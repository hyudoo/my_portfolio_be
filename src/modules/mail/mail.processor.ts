import { MailerService } from "@nestjs-modules/mailer";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ConfigService } from "@nestjs/config";
import { MAIL_QUEUE, MailJobName } from "../../constants/mail.queue.constant";

interface SendVerifyEmailData {
  email: string;
  verifyEmailUrl: string;
  username: string;
}

interface SendResetPasswordData {
  email: string;
  resetPasswordUrl: string;
  username: string;
}

interface SendContactNotificationData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface SendSubscribeConfirmationData {
  email: string;
  confirmUrl: string;
  unsubscribeUrl: string;
}

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case MailJobName.SEND_VERIFY_EMAIL: {
        const { email, verifyEmailUrl, username } = job.data as SendVerifyEmailData;
        await this.mailerService.sendMail({
          to: email,
          subject: "Welcome to Project! Please verify your email",
          template: "./verify-email",
          context: { email, verifyEmailUrl, username },
        });
        break;
      }
      case MailJobName.SEND_RESET_PASSWORD: {
        const { email, resetPasswordUrl, username } = job.data as SendResetPasswordData;
        await this.mailerService.sendMail({
          to: email,
          subject: "Reset password",
          template: "./reset-password",
          context: { resetPasswordUrl, username },
        });
        break;
      }
      case MailJobName.SEND_CONTACT_NOTIFICATION: {
        const { name, email, subject, message } = job.data as SendContactNotificationData;
        const ownerEmail = this.configService.get<string>("OWNER_EMAIL");
        await this.mailerService.sendMail({
          to: ownerEmail,
          subject: `[Portfolio] New contact: ${subject}`,
          template: "./contact-notification",
          context: { name, email, subject, message },
        });
        break;
      }
      case MailJobName.SEND_SUBSCRIBE_CONFIRMATION: {
        const { email, confirmUrl, unsubscribeUrl } = job.data as SendSubscribeConfirmationData;
        await this.mailerService.sendMail({
          to: email,
          subject: "Confirm your newsletter subscription",
          template: "./subscribe-confirmation",
          context: { email, confirmUrl, unsubscribeUrl },
        });
        break;
      }
    }
  }
}
