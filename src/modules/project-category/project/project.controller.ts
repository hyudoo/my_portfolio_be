import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../../../types/auth.type";
import { IdParam } from "../../../utils/dto/id-param.dto";
import { IdsBody } from "../../../utils/dto/ids-body.dto";
import { AuthUser } from "../../auth/decorators/auth-user.decorator";
import { RequiredPermissions } from "../../auth/decorators/required-permission.decorator";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ListProjectQuery } from "./dto/list-project-query.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectService } from "./project.service";

@Controller("projects")
@ApiTags("projects")
export class ProjectController {
  constructor(private service: ProjectService) {}

  @RequiredPermissions("project::write")
  @Post("/")
  async create(@AuthUser() authUser: IAuthUser, @Body() body: CreateProjectDto) {
    return this.service.create(authUser, body);
  }

  @RequiredPermissions("project::read")
  @Get("/")
  async list(@AuthUser() authUser: IAuthUser, @Query() query: ListProjectQuery) {
    return this.service.list(authUser, query);
  }

  @RequiredPermissions("project::read")
  @Get("/:id")
  async detail(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam) {
    return this.service.detail(authUser, id);
  }

  @RequiredPermissions("project::update")
  @Put("/:id")
  async update(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam, @Body() body: UpdateProjectDto) {
    return this.service.update(authUser, id, body);
  }

  @RequiredPermissions("project::delete")
  @Delete("/")
  async delete(@AuthUser() authUser: IAuthUser, @Body() body: IdsBody) {
    return this.service.delete(authUser, body);
  }
}
