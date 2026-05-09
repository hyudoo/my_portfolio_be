import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsStrongPassword, Length } from "class-validator";

export class UpdatePasswordBody {
  @ApiProperty({ type: "string" })
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiProperty({ type: "string" })
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}
