import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ContactStatus } from "../../../enums/contact-status.enum";

export class UpdateContactStatusDto {
  @ApiProperty({ enum: ContactStatus })
  @IsEnum(ContactStatus)
  status: ContactStatus;
}
