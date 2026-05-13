import { Body, Controller, Delete, Get, Param, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../../types/auth.type";
import { IdParam } from "../../utils/dto/id-param.dto";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { AuthUser } from "../auth/decorators/auth-user.decorator";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";
import { ListContactQuery } from "./dto/list-contact.dto";
import { UpdateContactStatusDto } from "./dto/update-contact-status.dto";
import { ContactService } from "./contact.service";

@Controller("contacts")
@ApiTags("contacts")
export class ContactController {
  constructor(private service: ContactService) {}

  @RequiredPermissions("contact::read")
  @Get("/")
  async list(@AuthUser() authUser: IAuthUser, @Query() query: ListContactQuery) {
    return this.service.list(authUser, query);
  }

  @RequiredPermissions("contact::read")
  @Get("/unread-count")
  async unreadCount() {
    const count = await this.service.unreadCount();
    return { count };
  }

  @RequiredPermissions("contact::read")
  @Get("/:id")
  async detail(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam) {
    return this.service.detail(authUser, id);
  }

  @RequiredPermissions("contact::update")
  @Put("/:id/status")
  async updateStatus(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam, @Body() body: UpdateContactStatusDto) {
    return this.service.updateStatus(authUser, id, body);
  }

  @RequiredPermissions("contact::delete")
  @Delete("/")
  async delete(@AuthUser() authUser: IAuthUser, @Body() body: IdsBody) {
    return this.service.delete(authUser, body);
  }
}
