import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, Length } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { Locale } from "../../../enums/locale.enum";

export class SubscribeDto {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsEmail()
  @Length(1, 255)
  email: string;

  @ApiPropertyOptional({ enum: Locale, default: Locale.En })
  @IsOptional()
  @IsEnum(Locale)
  locale: Locale = Locale.En;
}
