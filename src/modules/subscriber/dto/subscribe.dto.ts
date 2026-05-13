import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class SubscribeDto {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsEmail()
  @Length(1, 255)
  email: string;
}
