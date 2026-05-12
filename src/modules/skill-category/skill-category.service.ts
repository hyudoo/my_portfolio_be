import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { SkillCategoryEntity } from "../../database/entities/skill-category.entity";
import { AppException } from "../../exception/app.exception";
import { ErrorCode } from "../../exception/error-messages";
import { IAuthUser } from "../../types/auth.type";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { toSearchString } from "../../utils/to-search-string.util";
import { updateEntity } from "../../utils/update-entity.util";
import { CreateSkillCategoryDto } from "./dto/create-skill-category.dto";
import { UpdateSkillCategoryDto } from "./dto/update-skill-category.dto";

@Injectable()
export class SkillCategoryService {
  constructor(@InjectRepository(SkillCategoryEntity) private skillCategoryRepo: Repository<SkillCategoryEntity>) {}

  async list(authUser: IAuthUser, query: ListQuery) {
    const { keyword, take, skip } = query;

    const queryBuilder = this.skillCategoryRepo
      .createQueryBuilder("skillCategory")
      .addOrderBy("skillCategory.order", "ASC")
      .take(take)
      .skip(skip);

    if (keyword) {
      queryBuilder.andWhere("skillCategory.name ILIKE :search", { search: toSearchString(keyword) });
    }

    const [skillCategories, total] = await queryBuilder.getManyAndCount();
    return { skillCategories, total };
  }

  async detail(authUser: IAuthUser, id: number) {
    const skillCategory = await this.skillCategoryRepo.findOne({ where: { id } });
    if (!skillCategory) throw new AppException(ErrorCode.SKILL_CATEGORY_NOT_FOUND);
    return { skillCategory };
  }

  @Transactional()
  async create(authUser: IAuthUser, body: CreateSkillCategoryDto) {
    const skillCategory = this.skillCategoryRepo.create(body);
    await this.skillCategoryRepo.save(skillCategory);
  }

  @Transactional()
  async update(authUser: IAuthUser, id: number, body: UpdateSkillCategoryDto) {
    const skillCategory = await this.skillCategoryRepo.findOne({ where: { id } });
    if (!skillCategory) throw new AppException(ErrorCode.SKILL_CATEGORY_NOT_FOUND);

    updateEntity(skillCategory, body);
    await this.skillCategoryRepo.save(skillCategory);
  }

  @Transactional()
  async delete(authUser: IAuthUser, body: IdsBody) {
    await this.skillCategoryRepo.delete(body.ids);
  }

  async publicList() {
    const skillCategories = await this.skillCategoryRepo
      .createQueryBuilder("skillCategory")
      .leftJoinAndSelect("skillCategory.skills", "skill")
      .addOrderBy("skillCategory.order", "ASC")
      .addOrderBy("skill.order", "ASC")
      .getMany();

    return { skillCategories };
  }
}
