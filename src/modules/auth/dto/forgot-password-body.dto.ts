import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { ToLowerCase } from "../../../utils/decorators/to-lower-case.decorator";
import { Locale } from "../../../enums/locale.enum";

export class ForgotPasswordBody {
  @ApiProperty({ type: "string" })
  @Trim()
  @ToLowerCase()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ enum: Locale, default: Locale.En })
  @IsOptional()
  @IsEnum(Locale)
  locale: Locale = Locale.En;
}
