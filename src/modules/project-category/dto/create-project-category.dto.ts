import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import { IsUndefinable } from "../../../utils/decorators/is-undefinable.decorator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class CreateProjectCategoryDto {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(2, 10)
  locale: string;

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

  @ApiProperty({ required: false, type: "string" })
  @IsUndefinable()
  @IsString()
  @Length(1, 255)
  order?: string;
}
