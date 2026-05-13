import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { ListQuery } from "../../../utils/dto/list-query.dto";
import { ContactStatus } from "../../../enums/contact-status.enum";

export class ListContactQuery extends ListQuery {
  @ApiProperty({ required: false, enum: ContactStatus })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}
