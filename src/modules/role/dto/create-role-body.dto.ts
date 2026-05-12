import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsBoolean, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { ITEMS_MAX_COUNT, TEXTBOX_MAX_LENGTH } from "../../../constants/validation.constant";
import { ToBoolean } from "../../../utils/decorators/to-boolean.decorator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { ItemDto } from "../../../utils/dto/item.dto";

export class CreateRoleBody {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, TEXTBOX_MAX_LENGTH)
  name: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ required: false, type: ItemDto, isArray: true })
  @IsOptional()
  @Type(() => ItemDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(ITEMS_MAX_COUNT)
  permissions?: ItemDto[];
}
