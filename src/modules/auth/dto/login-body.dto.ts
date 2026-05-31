import { ApiProperty } from "@nestjs/swagger";
import { ToLowerCase } from "../../../utils/decorators/to-lower-case.decorator";
import { IsEmail, IsString, Length } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class LoginBody {
  @ApiProperty()
  @Trim()
  @ToLowerCase()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(1, 100)
  password: string;
}
