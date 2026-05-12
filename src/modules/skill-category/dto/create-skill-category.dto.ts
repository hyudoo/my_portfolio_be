import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Length, Min } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class CreateSkillCategoryDto {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ required: false, type: "string" })
  @IsOptional()
  @Trim()
  @IsString()
  @Length(1, 100)
  icon?: string;

  @ApiProperty({ required: false, type: "integer" })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
