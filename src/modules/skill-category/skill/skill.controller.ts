import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../../../types/auth.type";
import { IdParam } from "../../../utils/dto/id-param.dto";
import { IdsBody } from "../../../utils/dto/ids-body.dto";
import { ListQuery } from "../../../utils/dto/list-query.dto";
import { AuthUser } from "../../auth/decorators/auth-user.decorator";
import { RequiredPermissions } from "../../auth/decorators/required-permission.decorator";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { UpdateSkillDto } from "./dto/update-skill.dto";
import { SkillService } from "./skill.service";

@Controller("skills")
@ApiTags("skills")
export class SkillController {
  constructor(private service: SkillService) {}

  @RequiredPermissions("skill::write")
  @Post("/")
  async create(@AuthUser() authUser: IAuthUser, @Body() body: CreateSkillDto) {
    return this.service.create(authUser, body);
  }

  @RequiredPermissions("skill::read")
  @Get("/")
  async list(@AuthUser() authUser: IAuthUser, @Query() query: ListQuery) {
    return this.service.list(authUser, query);
  }

  @RequiredPermissions("skill::read")
  @Get("/:id")
  async detail(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam) {
    return this.service.detail(authUser, id);
  }

  @RequiredPermissions("skill::update")
  @Put("/:id")
  async update(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam, @Body() body: UpdateSkillDto) {
    return this.service.update(authUser, id, body);
  }

  @RequiredPermissions("skill::delete")
  @Delete("/")
  async delete(@AuthUser() authUser: IAuthUser, @Body() body: IdsBody) {
    return this.service.delete(authUser, body);
  }
}
