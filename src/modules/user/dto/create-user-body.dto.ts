import { ApiProperty } from "@nestjs/swagger";
import { Trim } from "../../../utils/decorators/trim.decorator";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";
import { ITEMS_MAX_COUNT, TEXTBOX_MAX_LENGTH } from "../../../constants/validation.constant";
import { ToLowerCase } from "../../../utils/decorators/to-lower-case.decorator";
import { ToStringOrNull } from "../../../utils/decorators/to-string-or-null.decorator";
import { ToBoolean } from "../../../utils/decorators/to-boolean.decorator";
import { ItemDto } from "../../../utils/dto/item.dto";
import { Type } from "class-transformer";

export class CreateUserBody {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, TEXTBOX_MAX_LENGTH)
  username: string;

  @ApiProperty({ type: String })
  @ToStringOrNull()
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @Length(1, TEXTBOX_MAX_LENGTH)
  email: string;

  @ApiProperty({ type: "boolean" })
  @ToBoolean()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false, type: ItemDto, isArray: true })
  @IsOptional()
  @Type(() => ItemDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(ITEMS_MAX_COUNT)
  roles?: ItemDto[];
}
