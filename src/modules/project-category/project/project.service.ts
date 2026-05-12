import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { FileEntity } from "../../../database/entities/file.entity";
import { ProjectCategoryEntity } from "../../../database/entities/project-category.entity";
import { ProjectEntity } from "../../../database/entities/project.entity";
import { SkillEntity } from "../../../database/entities/skill.entity";
import { AppException } from "../../../exception/app.exception";
import { ErrorCode } from "../../../exception/error-messages";
import { IAuthUser } from "../../../types/auth.type";
import { IdsBody } from "../../../utils/dto/ids-body.dto";
import { toSearchString } from "../../../utils/to-search-string.util";
import { updateEntity } from "../../../utils/update-entity.util";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ListProjectQuery } from "./dto/list-project-query.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private projectRepo: Repository<ProjectEntity>,
    @InjectRepository(FileEntity) private fileRepo: Repository<FileEntity>,
    @InjectRepository(SkillEntity) private skillRepo: Repository<SkillEntity>,
    @InjectRepository(ProjectCategoryEntity) private projectCategoryRepo: Repository<ProjectCategoryEntity>,
  ) {}

  async list(authUser: IAuthUser, query: ListProjectQuery) {
    const { keyword, take, skip, categoryId } = query;

    const queryBuilder = this.projectRepo
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.categories", "category")
      .leftJoinAndSelect("project.skills", "skill")
      .leftJoinAndSelect("project.files", "file")
      .addOrderBy("project.order", "ASC")
      .take(take)
      .skip(skip);

    if (keyword) {
      queryBuilder.andWhere("project.title ILIKE :search", { search: toSearchString(keyword) });
    }

    if (categoryId) {
      queryBuilder.andWhere("category.id = :categoryId", { categoryId });
    }

    const [projects, total] = await queryBuilder.getManyAndCount();
    return { projects, total };
  }

  async detail(authUser: IAuthUser, id: number) {
    const project = await this.projectRepo
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.categories", "category")
      .leftJoinAndSelect("project.skills", "skill")
      .leftJoinAndSelect("project.files", "file")
      .where("project.id = :id", { id })
      .getOne();

    if (!project) throw new AppException(ErrorCode.PROJECT_NOT_FOUND);
    return { project };
  }

  @Transactional()
  async create(authUser: IAuthUser, body: CreateProjectDto) {
    const { fileIds, skillIds, categoryIds, ...rest } = body;

    const project = this.projectRepo.create(rest);
    project.files = fileIds?.length ? await this.fileRepo.findBy({ id: In(fileIds) }) : [];
    project.skills = skillIds?.length ? await this.skillRepo.findBy({ id: In(skillIds) }) : [];
    project.categories = categoryIds?.length ? await this.projectCategoryRepo.findBy({ id: In(categoryIds) }) : [];

    await this.projectRepo.save(project);
  }

  @Transactional()
  async update(authUser: IAuthUser, id: number, body: UpdateProjectDto) {
    const project = await this.projectRepo
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.files", "file")
      .leftJoinAndSelect("project.skills", "skill")
      .leftJoinAndSelect("project.categories", "category")
      .where("project.id = :id", { id })
      .getOne();

    if (!project) throw new AppException(ErrorCode.PROJECT_NOT_FOUND);

    const { fileIds, skillIds, categoryIds, ...rest } = body;

    updateEntity(project, rest);

    if (fileIds !== undefined) {
      project.files = fileIds.length ? await this.fileRepo.findBy({ id: In(fileIds) }) : [];
    }
    if (skillIds !== undefined) {
      project.skills = skillIds.length ? await this.skillRepo.findBy({ id: In(skillIds) }) : [];
    }
    if (categoryIds !== undefined) {
      project.categories = categoryIds.length ? await this.projectCategoryRepo.findBy({ id: In(categoryIds) }) : [];
    }

    await this.projectRepo.save(project);
  }

  @Transactional()
  async delete(authUser: IAuthUser, body: IdsBody) {
    await this.projectRepo.delete(body.ids);
  }

  async publicList() {
    const projects = await this.projectRepo
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.categories", "category")
      .leftJoinAndSelect("project.skills", "skill")
      .leftJoinAndSelect("project.files", "file")
      .addOrderBy("project.order", "ASC")
      .getMany();

    return { projects };
  }
}
