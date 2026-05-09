import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";
import { ToLowerCase } from "src/utils/decorators/to-lower-case.decorator";
import { Trim } from "src/utils/decorators/trim.decorator";

export class VerifyEmailBody {
  @ApiProperty({ type: "string" })
  @ToLowerCase()
  @Trim()
  @IsEmail()
  email: string;

  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(6)
  code: string;
}
