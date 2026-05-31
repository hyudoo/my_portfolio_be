import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";
import { ListQuery } from "src/utils/dto/list-query.dto";

export class ListSkillsQuery extends ListQuery {
  @ApiProperty({ type: "number" })
  @Type(() => Number)
  @IsInt()
  categoryId: number;
}
