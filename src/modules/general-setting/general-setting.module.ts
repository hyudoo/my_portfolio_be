import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SettingEntity } from "../../database/entities/setting.entity";
import { GeneralSettingController } from "./general-setting.controller";
import { GeneralSettingService } from "./general-setting.service";

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  controllers: [GeneralSettingController],
  providers: [GeneralSettingService],
  exports: [GeneralSettingService],
})
export class GeneralSettingModule {}
