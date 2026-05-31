import { Body, Controller, Get, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";
import { GetSettingQuery } from "./dto/get-setting-query.dto";
import { UpdateGeneralSettingDto } from "./dto/update-general-setting.dto";
import { GeneralSettingService } from "./general-setting.service";

@Controller("general-setting")
@ApiTags("general-setting")
export class GeneralSettingController {
  constructor(private readonly generalSettingService: GeneralSettingService) {}

  @RequiredPermissions("general-setting::read")
  @Get("/")
  async get(@Query() { locale }: GetSettingQuery) {
    return this.generalSettingService.get(locale);
  }

  @RequiredPermissions("general-setting::update")
  @Put("/")
  async upsert(@Body() body: UpdateGeneralSettingDto) {
    return this.generalSettingService.upsert(body);
  }
}
