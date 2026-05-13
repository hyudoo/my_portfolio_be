import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import { ListQuery } from "../../../utils/dto/list-query.dto";

export class ListNotificationQuery extends ListQuery {
  @ApiProperty({ required: false, type: "boolean" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isRead?: boolean;
}
