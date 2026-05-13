import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class CreateContactDto {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ type: "string" })
  @Trim()
  @IsEmail()
  @Length(1, 255)
  email: string;

  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, 255)
  subject: string;

  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, 5000)
  message: string;
}
