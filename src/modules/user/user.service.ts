import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { UserEntity } from "../../database/entities/user.entity";
import { AppException } from "../../exception/app.exception";
import { ErrorCode } from "../../exception/error-messages";
import { IAuthUser } from "../../types/auth.type";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { toSearchString } from "../../utils/to-search-string.util";
import { updateEntity } from "../../utils/update-entity.util";
import { CreateUserBody } from "./dto/create-user-body.dto";
import { UpdateUserBody } from "./dto/update-user-body.dto";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}

  async list(authUser: IAuthUser, query: ListQuery) {
    const { keyword, take, skip } = query;

    const queryBuilder = this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role")
      .addOrderBy("user.id", "DESC")
      .take(take)
      .skip(skip);

    if (keyword) {
      queryBuilder.andWhere("user.username ILIKE :search", { search: toSearchString(keyword) });
    }

    const [users, total] = await queryBuilder.getManyAndCount();

    return { users, total };
  }

  async detail(authUser: IAuthUser, id: number) {
    const queryBuilder = this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role")
      .andWhere({ id });
    const user = await queryBuilder.getOne();

    return { user };
  }

  @Transactional()
  async create(authUser: IAuthUser, body: CreateUserBody) {
    const existing = await this.userRepo.findOne({ where: { email: body.email }, withDeleted: true });
    if (existing) {
      if (!existing?.deletedAt) {
        throw new AppException(ErrorCode.USER_REGISTERED);
      } else {
        await this.userRepo.remove(existing);
      }
    }

    const user = this.userRepo.create(body);

    await this.userRepo.save(user);
  }

  @Transactional()
  async update(authUser: IAuthUser, id: number, body: UpdateUserBody) {
    const user = await this.userRepo.findOneByOrFail({ id });

    updateEntity(user, body);

    await this.userRepo.save(user);
  }

  @Transactional()
  async delete(authUser: IAuthUser, body: IdsBody) {
    const { ids } = body;

    await this.userRepo.delete(ids);
  }
}
