import { MailerService } from "@nestjs-modules/mailer";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { MAIL_QUEUE, MailJobName } from "./mail.queue.constant";

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

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
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
    }
  }
}
