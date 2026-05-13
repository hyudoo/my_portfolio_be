import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PermitAll } from "../auth/decorators/permit-all.decorator";
import { ContactService } from "../contact/contact.service";
import { CreateContactDto } from "../contact/dto/create-contact.dto";
import { ProjectCategoryService } from "../project-category/project-category.service";
import { ProjectService } from "../project-category/project/project.service";
import { SkillCategoryService } from "../skill-category/skill-category.service";

@PermitAll()
@Controller("public")
@ApiTags("public")
export class PublicController {
  constructor(
    private skillCategoryService: SkillCategoryService,
    private projectCategoryService: ProjectCategoryService,
    private projectService: ProjectService,
    private contactService: ContactService,
  ) {}

  @Get("/skills")
  async listGroupedByCategory() {
    return this.skillCategoryService.publicList();
  }

  @Get("/project-categories")
  async listProjectCategories() {
    return this.projectCategoryService.publicList();
  }

  @Get("/projects")
  async listProjects() {
    return this.projectService.publicList();
  }

  @Post("/contact")
  async submitContact(@Body() body: CreateContactDto) {
    return this.contactService.submitPublic(body);
  }
}
