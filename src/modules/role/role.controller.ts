import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../../types/auth.type";
import { IdParam } from "../../utils/dto/id-param.dto";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { AuthUser } from "../auth/decorators/auth-user.decorator";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";
import { CreateRoleBody } from "./dto/create-role-body.dto";
import { UpdateRoleBody } from "./dto/update-role-body.dto";
import { RoleService } from "./role.service";

@Controller("roles")
@ApiTags("roles")
export class RoleController {
  constructor(private service: RoleService) {}

  @RequiredPermissions("role::write")
  @Post("/")
  async create(@AuthUser() authUser: IAuthUser, @Body() body: CreateRoleBody) {
    return this.service.create(authUser, body);
  }

  @RequiredPermissions("role::read")
  @Get("/")
  async list(@AuthUser() authUser: IAuthUser, @Query() query: ListQuery) {
    return this.service.list(authUser, query);
  }

  @RequiredPermissions("role::read")
  @Get("/:id")
  async detail(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam) {
    return this.service.detail(authUser, id);
  }

  @RequiredPermissions("role::update")
  @Put("/:id")
  async update(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam, @Body() body: UpdateRoleBody) {
    return this.service.update(authUser, id, body);
  }

  @RequiredPermissions("role::delete")
  @Delete("/")
  async delete(@AuthUser() authUser: IAuthUser, @Body() body: IdsBody) {
    return this.service.delete(authUser, body);
  }
}
