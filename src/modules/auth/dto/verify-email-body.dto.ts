import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Trim } from "src/utils/decorators/trim.decorator";

export class VerifyEmailBody {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  token: string;
}
