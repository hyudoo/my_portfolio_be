import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../../types/auth.type";
import { IdParam } from "../../utils/dto/id-param.dto";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { AuthUser } from "../auth/decorators/auth-user.decorator";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";
import { CreateSkillCategoryDto } from "./dto/create-skill-category.dto";
import { UpdateSkillCategoryDto } from "./dto/update-skill-category.dto";
import { SkillCategoryService } from "./skill-category.service";

@Controller("skill-categories")
@ApiTags("skill-categories")
export class SkillCategoryController {
  constructor(private service: SkillCategoryService) {}

  @RequiredPermissions("skill-category::write")
  @Post("/")
  async create(@AuthUser() authUser: IAuthUser, @Body() body: CreateSkillCategoryDto) {
    return this.service.create(authUser, body);
  }

  @RequiredPermissions("skill-category::read")
  @Get("/")
  async list(@AuthUser() authUser: IAuthUser, @Query() query: ListQuery) {
    return this.service.list(authUser, query);
  }

  @RequiredPermissions("skill-category::read")
  @Get("/:id")
  async detail(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam) {
    return this.service.detail(authUser, id);
  }

  @RequiredPermissions("skill-category::update")
  @Put("/:id")
  async update(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam, @Body() body: UpdateSkillCategoryDto) {
    return this.service.update(authUser, id, body);
  }

  @RequiredPermissions("skill-category::delete")
  @Delete("/")
  async delete(@AuthUser() authUser: IAuthUser, @Body() body: IdsBody) {
    return this.service.delete(authUser, body);
  }
}
