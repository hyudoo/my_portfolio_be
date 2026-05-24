import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ToLowerCase } from "../../../utils/decorators/to-lower-case.decorator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { IsEmail, IsEnum, IsOptional } from "class-validator";
import { Locale } from "../../../enums/locale.enum";

export class ResendVerifyEmailBody {
  @ApiProperty({ type: "string" })
  @ToLowerCase()
  @Trim()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ enum: Locale, default: Locale.En })
  @IsOptional()
  @IsEnum(Locale)
  locale: Locale = Locale.En;
}
