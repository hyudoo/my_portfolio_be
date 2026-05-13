import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VerificationCodeEntity } from "../../database/entities/verification-code.entity";
import { SubscriberEntity } from "../../database/entities/subscriber.entity";
import { MailModule } from "../mail/mail.module";
import { SubscriberController } from "./subscriber.controller";
import { SubscriberService } from "./subscriber.service";

@Module({
  imports: [TypeOrmModule.forFeature([SubscriberEntity, VerificationCodeEntity]), MailModule],
  controllers: [SubscriberController],
  providers: [SubscriberService],
  exports: [SubscriberService],
})
export class SubscriberModule {}
