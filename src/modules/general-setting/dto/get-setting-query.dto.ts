import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class GetSettingQuery {
  @ApiProperty({ type: "string", default: "vi" })
  @Trim()
  @IsString()
  @Length(2, 10)
  locale: string = "vi";
}
