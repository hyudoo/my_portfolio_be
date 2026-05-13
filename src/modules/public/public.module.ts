import { Module } from "@nestjs/common";
import { ContactModule } from "../contact/contact.module";
import { ProjectCategoryModule } from "../project-category/project-category.module";
import { SkillCategoryModule } from "../skill-category/skill-category.module";
import { PublicController } from "./public.controller";

@Module({
  imports: [SkillCategoryModule, ProjectCategoryModule, ContactModule],
  controllers: [PublicController],
})
export class PublicModule {}
