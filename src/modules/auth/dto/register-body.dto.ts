import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";
import { TEXTBOX_MAX_LENGTH } from "../../../constants/validation.constant";
import { ToLowerCase } from "../../../utils/decorators/to-lower-case.decorator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class RegisterBody {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, TEXTBOX_MAX_LENGTH)
  username: string;

  @ApiProperty({ type: "string" })
  @ToLowerCase()
  @Trim()
  @IsEmail()
  email: string;

  @ApiProperty({ type: "string" })
  @IsString()
  @IsStrongPassword()
  password: string;
}
