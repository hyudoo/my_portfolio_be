import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../../database";
import { ProjectCategoryController } from "./project-category.controller";
import { ProjectCategoryService } from "./project-category.service";
import { ProjectModule } from "./project/project.module";

@Module({
  imports: [TypeOrmModule.forFeature(entities), ProjectModule],
  controllers: [ProjectCategoryController],
  providers: [ProjectCategoryService],
  exports: [ProjectCategoryService, ProjectModule],
})
export class ProjectCategoryModule {}
