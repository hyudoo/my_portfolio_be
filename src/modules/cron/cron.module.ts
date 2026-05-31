import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../../database";
import { NotificationModule } from "../notification/notification.module";
import { FileModule } from "../file/file.module";
import { CronService } from "./cron.service";
import { OrderRebalanceCron } from "./order-rebalance.cron";

@Module({
  imports: [TypeOrmModule.forFeature(entities), NotificationModule, FileModule],
  providers: [CronService, OrderRebalanceCron],
})
export class CronModule {}
