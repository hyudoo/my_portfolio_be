import { Module } from "@nestjs/common";
import { SkillCategoryModule } from "../skill-category/skill-category.module";
import { PublicController } from "./public.controller";

@Module({
  imports: [SkillCategoryModule],
  controllers: [PublicController],
})
export class PublicModule {}
