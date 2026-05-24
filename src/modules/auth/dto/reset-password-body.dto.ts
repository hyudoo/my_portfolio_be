import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsStrongPassword } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class ResetPasswordBody {
  @ApiProperty({ type: "string", required: true })
  @Trim()
  @IsString()
  token: string;

  @ApiProperty({ type: "string", required: true })
  @Trim()
  @IsString()
  @IsStrongPassword()
  password: string;
}
