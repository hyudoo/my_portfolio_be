import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";
import { PermissionService } from "./permission.service";

@Controller("permissions")
@ApiTags("permissions")
export class PermissionController {
  constructor(private service: PermissionService) {}

  @RequiredPermissions("permission::read")
  @Get("/")
  async list(@Query() query: ListQuery) {
    return this.service.list(query);
  }
}
