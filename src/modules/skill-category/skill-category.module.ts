import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../../database";
import { SkillCategoryController } from "./skill-category.controller";
import { SkillCategoryService } from "./skill-category.service";
import { SkillModule } from "./skill/skill.module";

@Module({
  imports: [TypeOrmModule.forFeature(entities), SkillModule],
  controllers: [SkillCategoryController],
  providers: [SkillCategoryService],
  exports: [SkillCategoryService],
})
export class SkillCategoryModule {}
