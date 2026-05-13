import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactEntity } from "../../database/entities/contact.entity";
import { NotificationEntity } from "../../database/entities/notification.entity";
import { MailModule } from "../mail/mail.module";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity, NotificationEntity]), MailModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
