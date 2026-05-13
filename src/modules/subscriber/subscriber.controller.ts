import { Body, Controller, Delete, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";
import { ListSubscriberQuery } from "./dto/list-subscriber.dto";
import { SubscriberService } from "./subscriber.service";

@Controller("subscribers")
@ApiTags("subscribers")
export class SubscriberController {
  constructor(private readonly service: SubscriberService) {}

  @RequiredPermissions("subscriber::read")
  @Get("/")
  async list(@Query() query: ListSubscriberQuery) {
    return this.service.list(query);
  }

  @RequiredPermissions("subscriber::delete")
  @Delete("/")
  async delete(@Body() body: IdsBody) {
    return this.service.delete(body);
  }
}
