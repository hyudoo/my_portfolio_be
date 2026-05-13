import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PermitAll } from "../auth/decorators/permit-all.decorator";
import { ContactService } from "../contact/contact.service";
import { CreateContactDto } from "../contact/dto/create-contact.dto";
import { ProjectCategoryService } from "../project-category/project-category.service";
import { ProjectService } from "../project-category/project/project.service";
import { SkillCategoryService } from "../skill-category/skill-category.service";
import { SubscribeDto } from "../subscriber/dto/subscribe.dto";
import { TokenQuery } from "../subscriber/dto/token-query.dto";
import { SubscriberService } from "../subscriber/subscriber.service";

@PermitAll()
@Controller("public")
@ApiTags("public")
export class PublicController {
  constructor(
    private skillCategoryService: SkillCategoryService,
    private projectCategoryService: ProjectCategoryService,
    private projectService: ProjectService,
    private contactService: ContactService,
    private subscriberService: SubscriberService,
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

  @Post("/subscribe")
  async subscribe(@Body() body: SubscribeDto) {
    return this.subscriberService.subscribe(body);
  }

  @Get("/subscribe/confirm")
  async confirmSubscription(@Query() { token }: TokenQuery) {
    return this.subscriberService.confirm(token);
  }

  @Get("/unsubscribe")
  async unsubscribe(@Query() { token }: TokenQuery) {
    return this.subscriberService.unsubscribe(token);
  }
}
