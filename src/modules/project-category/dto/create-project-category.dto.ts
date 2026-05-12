import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Length, Min } from "class-validator";
import { IsUndefinable } from "../../../utils/decorators/is-undefinable.decorator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class CreateProjectCategoryDto {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, 100)
  slug: string;

  @ApiProperty({ required: false, type: "integer" })
  @IsUndefinable()
  @IsInt()
  @Min(0)
  order?: number;
}
