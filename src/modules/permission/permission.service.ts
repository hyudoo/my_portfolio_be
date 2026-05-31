import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntity } from "../../database/entities/permission.entity";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { toSearchString } from "../../utils/to-search-string.util";

@Injectable()
export class PermissionService {
  constructor(@InjectRepository(PermissionEntity) private permissionRepo: Repository<PermissionEntity>) {}

  async list(query: ListQuery) {
    const { keyword } = query;

    const queryBuilder = this.permissionRepo.createQueryBuilder("permission").addOrderBy("permission.action", "ASC");

    if (keyword) {
      queryBuilder.andWhere("permission.action ILIKE :search", { search: toSearchString(keyword) });
    }

    const [permissions, total] = await queryBuilder.getManyAndCount();
    return { permissions, total };
  }
}
