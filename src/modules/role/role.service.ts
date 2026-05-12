import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Redis from "ioredis";
import { Not, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { REDIS_CLIENT, roleCacheKey } from "../../constants/auth.constants";
import { PermissionEntity } from "../../database/entities/permission.entity";
import { RoleEntity } from "../../database/entities/role.entity";
import { AppException } from "../../exception/app.exception";
import { ErrorCode } from "../../exception/error-messages";
import { IAuthUser } from "../../types/auth.type";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { toSearchString } from "../../utils/to-search-string.util";
import { updateEntity } from "../../utils/update-entity.util";
import { CreateRoleBody } from "./dto/create-role-body.dto";
import { UpdateRoleBody } from "./dto/update-role-body.dto";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @Inject(REDIS_CLIENT) private redisClient: Redis,
  ) {}

  async list(authUser: IAuthUser, query: ListQuery) {
    const { keyword, take, skip } = query;

    const queryBuilder = this.roleRepo
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.permissions", "permission")
      .addOrderBy("role.id", "DESC")
      .take(take)
      .skip(skip);

    if (keyword) {
      queryBuilder.andWhere("role.name ILIKE :search", { search: toSearchString(keyword) });
    }

    const [roles, total] = await queryBuilder.getManyAndCount();
    return { roles, total };
  }

  async detail(authUser: IAuthUser, id: number) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: { permissions: true },
    });
    return { role };
  }

  @Transactional()
  async create(authUser: IAuthUser, body: CreateRoleBody) {
    const { permissions, isDefault, ...rest } = body;

    if (isDefault) {
      await this.roleRepo.update({ isDefault: true }, { isDefault: false });
    }

    const role = this.roleRepo.create({
      ...rest,
      isDefault: isDefault ?? false,
      permissions: permissions?.map((p) => ({ id: p.id }) as PermissionEntity),
    });

    await this.roleRepo.save(role);
  }

  @Transactional()
  async update(authUser: IAuthUser, id: number, body: UpdateRoleBody) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: { permissions: true },
    });
    if (!role) throw new AppException(ErrorCode.ROLE_NOT_FOUND);

    if (role.isDefault && body.isDefault === false) {
      throw new AppException(ErrorCode.ROLE_DEFAULT_REQUIRED);
    }

    if (body.isDefault) {
      await this.roleRepo.update({ id: Not(id), isDefault: true }, { isDefault: false });
    }

    const { permissions, ...rest } = body;
    updateEntity(role, rest);
    if (permissions !== undefined) {
      role.permissions = permissions.map((p) => ({ id: p.id }) as PermissionEntity);
    }

    await this.roleRepo.save(role);
    await this.redisClient.del(roleCacheKey(id));
  }

  @Transactional()
  async delete(authUser: IAuthUser, body: IdsBody) {
    const { ids } = body;

    await this.roleRepo.delete(ids);
    await this.redisClient.del(...ids.map(roleCacheKey));
  }
}
