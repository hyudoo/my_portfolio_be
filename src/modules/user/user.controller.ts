import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../../types/auth.type";
import { IdParam } from "../../utils/dto/id-param.dto";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { AuthUser } from "../auth/decorators/auth-user.decorator";
import { CreateUserBody } from "./dto/create-user-body.dto";
import { UpdateUserBody } from "./dto/update-user-body.dto";
import { UserService } from "./user.service";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";

@Controller("users")
@ApiTags("users")
export class UserController {
  constructor(private service: UserService) {}

  @RequiredPermissions("user::write")
  @Post("/")
  async create(@AuthUser() authUser: IAuthUser, @Body() body: CreateUserBody) {
    return this.service.create(authUser, body);
  }

  @RequiredPermissions("user::read")
  @Get("/")
  async list(@AuthUser() authUser: IAuthUser, @Query() query: ListQuery) {
    return this.service.list(authUser, query);
  }

  @RequiredPermissions("user::read")
  @Get("/:id")
  async detail(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam) {
    return this.service.detail(authUser, id);
  }

  @RequiredPermissions("user::update")
  @Put("/:id")
  async update(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam, @Body() body: UpdateUserBody) {
    return this.service.update(authUser, id, body);
  }

  @RequiredPermissions("user::delete")
  @Delete("/")
  async delete(@AuthUser() authUser: IAuthUser, @Body() body: IdsBody) {
    return this.service.delete(authUser, body);
  }
}
