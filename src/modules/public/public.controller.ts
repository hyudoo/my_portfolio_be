import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PermitAll } from "../auth/decorators/permit-all.decorator";
import { ContactService } from "../contact/contact.service";
import { CreateContactDto } from "../contact/dto/create-contact.dto";
import { ProjectCategoryService } from "../project-category/project-category.service";
import { ProjectService } from "../project-category/project/project.service";
import { GeneralSettingService } from "../general-setting/general-setting.service";
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
    private generalSettingService: GeneralSettingService,
  ) {}

  @Get("/skills")
  async listGroupedByCategory(@Query("locale") locale?: string) {
    return this.skillCategoryService.publicList(locale);
  }

  @Get("/project-categories")
  async listProjectCategories(@Query("locale") locale?: string) {
    return this.projectCategoryService.publicList(locale);
  }

  @Get("/projects")
  async listProjects(@Query("locale") locale?: string) {
    return this.projectService.publicList(locale);
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

  @Get("/settings")
  async getSettings(@Query("locale") locale: string = "vi") {
    return this.generalSettingService.publicGet(locale);
  }
}
