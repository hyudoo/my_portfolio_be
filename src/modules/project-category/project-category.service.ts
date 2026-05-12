import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { ProjectCategoryEntity } from "../../database/entities/project-category.entity";
import { AppException } from "../../exception/app.exception";
import { ErrorCode } from "../../exception/error-messages";
import { IAuthUser } from "../../types/auth.type";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { toSearchString } from "../../utils/to-search-string.util";
import { updateEntity } from "../../utils/update-entity.util";
import { CreateProjectCategoryDto } from "./dto/create-project-category.dto";
import { UpdateProjectCategoryDto } from "./dto/update-project-category.dto";

@Injectable()
export class ProjectCategoryService {
  constructor(
    @InjectRepository(ProjectCategoryEntity) private projectCategoryRepo: Repository<ProjectCategoryEntity>,
  ) {}

  async list(authUser: IAuthUser, query: ListQuery) {
    const { keyword, take, skip } = query;

    const queryBuilder = this.projectCategoryRepo
      .createQueryBuilder("projectCategory")
      .addOrderBy("projectCategory.order", "ASC")
      .take(take)
      .skip(skip);

    if (keyword) {
      queryBuilder.andWhere("projectCategory.name ILIKE :search", { search: toSearchString(keyword) });
    }

    const [projectCategories, total] = await queryBuilder.getManyAndCount();
    return { projectCategories, total };
  }

  async detail(authUser: IAuthUser, id: number) {
    const projectCategory = await this.projectCategoryRepo.findOne({ where: { id } });
    if (!projectCategory) throw new AppException(ErrorCode.PROJECT_CATEGORY_NOT_FOUND);
    return { projectCategory };
  }

  @Transactional()
  async create(authUser: IAuthUser, body: CreateProjectCategoryDto) {
    const projectCategory = this.projectCategoryRepo.create(body);
    await this.projectCategoryRepo.save(projectCategory);
  }

  @Transactional()
  async update(authUser: IAuthUser, id: number, body: UpdateProjectCategoryDto) {
    const projectCategory = await this.projectCategoryRepo.findOne({ where: { id } });
    if (!projectCategory) throw new AppException(ErrorCode.PROJECT_CATEGORY_NOT_FOUND);

    updateEntity(projectCategory, body);
    await this.projectCategoryRepo.save(projectCategory);
  }

  @Transactional()
  async delete(authUser: IAuthUser, body: IdsBody) {
    await this.projectCategoryRepo.delete(body.ids);
  }

  async publicList() {
    const projectCategories = await this.projectCategoryRepo
      .createQueryBuilder("projectCategory")
      .addOrderBy("projectCategory.order", "ASC")
      .getMany();

    return { projectCategories };
  }
}
