import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsString, Max, Min } from "class-validator";
import { Trim } from "../../../utils/decorators/trim.decorator";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export class GetPresignedUrlBody {
  @ApiProperty()
  @Trim()
  @IsString()
  filename: string;

  @ApiProperty()
  @Trim()
  @IsString()
  contentType: string;

  @ApiProperty({ type: "number" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_FILE_SIZE)
  size: number;

  @ApiProperty()
  @IsBoolean()
  isPublic: boolean;
}
