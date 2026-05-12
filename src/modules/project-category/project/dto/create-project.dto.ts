import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsString, Length, Min } from "class-validator";
import { IsUndefinable } from "../../../../utils/decorators/is-undefinable.decorator";
import { Trim } from "../../../../utils/decorators/trim.decorator";

export class CreateProjectDto {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  description: string;

  @ApiProperty({ required: false, type: "string" })
  @IsUndefinable()
  @Trim()
  @IsString()
  @Length(1, 500)
  liveUrl?: string;

  @ApiProperty({ required: false, type: "string" })
  @IsUndefinable()
  @Trim()
  @IsString()
  @Length(1, 500)
  githubUrl?: string;

  @ApiProperty({ required: false, type: "boolean" })
  @IsUndefinable()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ required: false, type: "integer" })
  @IsUndefinable()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiProperty({ required: false, type: "array", items: { type: "integer" } })
  @IsUndefinable()
  @IsArray()
  @IsInt({ each: true })
  fileIds?: number[];

  @ApiProperty({ required: false, type: "array", items: { type: "integer" } })
  @IsUndefinable()
  @IsArray()
  @IsInt({ each: true })
  skillIds?: number[];

  @ApiProperty({ required: false, type: "array", items: { type: "integer" } })
  @IsUndefinable()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}
