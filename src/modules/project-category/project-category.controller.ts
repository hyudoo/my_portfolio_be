import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../../types/auth.type";
import { IdParam } from "../../utils/dto/id-param.dto";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { AuthUser } from "../auth/decorators/auth-user.decorator";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";
import { CreateProjectCategoryDto } from "./dto/create-project-category.dto";
import { UpdateProjectCategoryDto } from "./dto/update-project-category.dto";
import { ProjectCategoryService } from "./project-category.service";

@Controller("project-categories")
@ApiTags("project-categories")
export class ProjectCategoryController {
  constructor(private service: ProjectCategoryService) {}

  @RequiredPermissions("project-category::write")
  @Post("/")
  async create(@AuthUser() authUser: IAuthUser, @Body() body: CreateProjectCategoryDto) {
    return this.service.create(authUser, body);
  }

  @RequiredPermissions("project-category::read")
  @Get("/")
  async list(@AuthUser() authUser: IAuthUser, @Query() query: ListQuery) {
    return this.service.list(authUser, query);
  }

  @RequiredPermissions("project-category::read")
  @Get("/:id")
  async detail(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam) {
    return this.service.detail(authUser, id);
  }

  @RequiredPermissions("project-category::update")
  @Put("/:id")
  async update(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam, @Body() body: UpdateProjectCategoryDto) {
    return this.service.update(authUser, id, body);
  }

  @RequiredPermissions("project-category::delete")
  @Delete("/")
  async delete(@AuthUser() authUser: IAuthUser, @Body() body: IdsBody) {
    return this.service.delete(authUser, body);
  }
}
