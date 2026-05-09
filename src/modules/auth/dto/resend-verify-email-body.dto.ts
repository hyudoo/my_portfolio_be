import { ApiProperty } from "@nestjs/swagger";
import { ToLowerCase } from "../../../utils/decorators/to-lower-case.decorator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { IsEmail } from "class-validator";

export class ResendVerifyEmailBody {
  @ApiProperty({ type: "string" })
  @ToLowerCase()
  @Trim()
  @IsEmail()
  email: string;
}
