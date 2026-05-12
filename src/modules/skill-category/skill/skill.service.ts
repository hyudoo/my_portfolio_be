import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { SkillCategoryEntity } from "../../../database/entities/skill-category.entity";
import { SkillEntity } from "../../../database/entities/skill.entity";
import { AppException } from "../../../exception/app.exception";
import { ErrorCode } from "../../../exception/error-messages";
import { IAuthUser } from "../../../types/auth.type";
import { IdsBody } from "../../../utils/dto/ids-body.dto";
import { ListQuery } from "../../../utils/dto/list-query.dto";
import { toSearchString } from "../../../utils/to-search-string.util";
import { updateEntity } from "../../../utils/update-entity.util";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { UpdateSkillDto } from "./dto/update-skill.dto";

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity) private skillRepo: Repository<SkillEntity>,
    @InjectRepository(SkillCategoryEntity) private skillCategoryRepo: Repository<SkillCategoryEntity>,
  ) {}

  async list(authUser: IAuthUser, query: ListQuery) {
    const { keyword, take, skip } = query;

    const queryBuilder = this.skillRepo
      .createQueryBuilder("skill")
      .leftJoinAndSelect("skill.category", "category")
      .addOrderBy("skill.order", "ASC")
      .take(take)
      .skip(skip);

    if (keyword) {
      queryBuilder.andWhere("skill.name ILIKE :search", { search: toSearchString(keyword) });
    }

    const [skills, total] = await queryBuilder.getManyAndCount();
    return { skills, total };
  }

  async detail(authUser: IAuthUser, id: number) {
    const skill = await this.skillRepo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!skill) throw new AppException(ErrorCode.SKILL_NOT_FOUND);
    return { skill };
  }

  @Transactional()
  async create(authUser: IAuthUser, body: CreateSkillDto) {
    const skillCategory = await this.skillCategoryRepo.findOne({ where: { id: body.categoryId } });
    if (!skillCategory) throw new AppException(ErrorCode.SKILL_CATEGORY_NOT_FOUND);

    const skill = this.skillRepo.create(body);
    await this.skillRepo.save(skill);
  }

  @Transactional()
  async update(authUser: IAuthUser, id: number, body: UpdateSkillDto) {
    const skill = await this.skillRepo.findOne({ where: { id } });
    if (!skill) throw new AppException(ErrorCode.SKILL_NOT_FOUND);

    if (body.categoryId !== undefined) {
      const skillCategory = await this.skillCategoryRepo.findOne({ where: { id: body.categoryId } });
      if (!skillCategory) throw new AppException(ErrorCode.SKILL_CATEGORY_NOT_FOUND);
    }

    updateEntity(skill, body);
    await this.skillRepo.save(skill);
  }

  @Transactional()
  async delete(authUser: IAuthUser, body: IdsBody) {
    await this.skillRepo.delete(body.ids);
  }
}
