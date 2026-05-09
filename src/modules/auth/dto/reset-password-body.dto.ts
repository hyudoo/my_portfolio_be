import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { ToLowerCase } from "../../../utils/decorators/to-lower-case.decorator";

export class ResetPasswordBody {
  @ApiProperty({ type: "string", required: true })
  @Trim()
  @ToLowerCase()
  @IsEmail()
  email: string;

  @ApiProperty({ type: "string", required: true })
  @Trim()
  @IsString()
  @Length(6)
  code: string;

  @ApiProperty({ type: "string", required: true })
  @Trim()
  @IsString()
  @IsStrongPassword()
  password: string;
}
