import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { ToLowerCase } from "../../../utils/decorators/to-lower-case.decorator";

export class ForgotPasswordBody {
  @ApiProperty({ type: "string" })
  @Trim()
  @ToLowerCase()
  @IsEmail()
  email: string;
}
