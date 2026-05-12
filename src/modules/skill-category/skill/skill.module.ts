import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../../../database";
import { SkillController } from "./skill.controller";
import { SkillService } from "./skill.service";

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule {}
