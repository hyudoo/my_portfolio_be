import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsString, Min } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";
import { ToBoolean } from "../../../utils/decorators/to-boolean.decorator";

export class SaveFileMetadataBody {
  @ApiProperty()
  @Trim()
  @IsString()
  name: string;

  @ApiProperty()
  @Trim()
  @IsString()
  s3Key: string;

  @ApiProperty({ type: "number" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size: number;

  @ApiProperty()
  @ToBoolean()
  @IsBoolean()
  isPublic: boolean;
}
