import { Module } from "@nestjs/common";
import { ProjectCategoryModule } from "../project-category/project-category.module";
import { SkillCategoryModule } from "../skill-category/skill-category.module";
import { PublicController } from "./public.controller";

@Module({
  imports: [SkillCategoryModule, ProjectCategoryModule],
  controllers: [PublicController],
})
export class PublicModule {}
