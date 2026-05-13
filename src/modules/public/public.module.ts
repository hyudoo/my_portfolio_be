import { Module } from "@nestjs/common";
import { ContactModule } from "../contact/contact.module";
import { ProjectCategoryModule } from "../project-category/project-category.module";
import { SkillCategoryModule } from "../skill-category/skill-category.module";
import { SubscriberModule } from "../subscriber/subscriber.module";
import { PublicController } from "./public.controller";

@Module({
  imports: [SkillCategoryModule, ProjectCategoryModule, ContactModule, SubscriberModule],
  controllers: [PublicController],
})
export class PublicModule {}
