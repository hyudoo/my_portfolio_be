import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from "../../constants/env-key.constant";
import { MailProcessor } from "./mail.processor";
import { MAIL_QUEUE } from "./mail.queue.constant";
import { MailService } from "./mail.service";

@Module({
  imports: [
    BullModule.registerQueue({
      name: MAIL_QUEUE,
      defaultJobOptions: {
        attempts: 5,
        backoff: 3000,
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get(SMTP_HOST),
          port: config.get(SMTP_PORT),
          secure: false,
          auth: {
            user: config.get(SMTP_USER),
            pass: config.get(SMTP_PASSWORD),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get(SMTP_FROM)}`,
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
