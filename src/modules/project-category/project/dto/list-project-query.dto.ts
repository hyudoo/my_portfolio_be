import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";
import { IsUndefinable } from "../../../../utils/decorators/is-undefinable.decorator";
import { ListQuery } from "../../../../utils/dto/list-query.dto";

export class ListProjectQuery extends ListQuery {
  @ApiProperty({ required: false, type: "integer" })
  @IsUndefinable()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;
}
