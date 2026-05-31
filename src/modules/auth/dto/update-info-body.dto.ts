import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Length } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { TEXTBOX_MAX_LENGTH } from "../../../constants/validation.constant";

export class UpdateInfoBody {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, TEXTBOX_MAX_LENGTH)
  username: string;

  @ApiPropertyOptional({ type: "number" })
  @IsOptional()
  @IsInt()
  avatarId?: number;
}
