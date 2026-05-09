import { ApiProperty } from "@nestjs/swagger";
import { ToLowerCase } from "../../../utils/decorators/to-lower-case.decorator";
import { IsBoolean, IsEmail, IsString, Length } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { IsUndefinable } from "../../../utils/decorators/is-undefinable.decorator";
import { ToBoolean } from "../../../utils/decorators/to-boolean.decorator";

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

  @ApiProperty({ required: false, type: "boolean" })
  @IsUndefinable()
  @ToBoolean()
  @IsBoolean()
  remember?: boolean;
}
