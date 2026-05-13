import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { ToBoolean } from "../../../utils/decorators/to-boolean.decorator";
import { ListQuery } from "../../../utils/dto/list-query.dto";

export class ListSubscriberQuery extends ListQuery {
  @ApiProperty({ required: false, type: "boolean" })
  @IsOptional()
  @ToBoolean({ optional: true })
  @IsBoolean()
  confirmed?: boolean;
}
