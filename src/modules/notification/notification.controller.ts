import { Body, Controller, Delete, Get, Param, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../../types/auth.type";
import { IdParam } from "../../utils/dto/id-param.dto";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { AuthUser } from "../auth/decorators/auth-user.decorator";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";
import { ListNotificationQuery } from "./dto/list-notification.dto";
import { NotificationService } from "./notification.service";

@Controller("notifications")
@ApiTags("notifications")
export class NotificationController {
  constructor(private service: NotificationService) {}

  @Get("/")
  async list(@AuthUser() authUser: IAuthUser, @Query() query: ListNotificationQuery) {
    return this.service.list(authUser, query);
  }

  @Get("/unread-count")
  async unreadCount() {
    return this.service.unreadCount();
  }

  @Put("/read-all")
  async markAllRead(@AuthUser() authUser: IAuthUser) {
    return this.service.markAllRead(authUser);
  }

  @Put("/:id/read")
  async markRead(@AuthUser() authUser: IAuthUser, @Param() { id }: IdParam) {
    return this.service.markRead(authUser, id);
  }

  @Delete("/")
  async delete(@AuthUser() authUser: IAuthUser, @Body() body: IdsBody) {
    return this.service.delete(authUser, body);
  }
}
