import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PermitAll } from "../auth/decorators/permit-all.decorator";
import { SkillCategoryService } from "../skill-category/skill-category.service";

@PermitAll()
@Controller("public")
@ApiTags("public")
export class PublicController {
  constructor(private skillCategoryService: SkillCategoryService) {}

  @Get("/skills")
  async listGroupedByCategory() {
    return this.skillCategoryService.publicList();
  }
}
