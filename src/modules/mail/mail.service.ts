import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { MAIL_QUEUE, MailJobName } from "../../constants/mail.queue.constant";

@Injectable()
export class MailService {
  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) {}

  async sendResetPasswordEmail(email: string, resetPasswordUrl: string, username: string) {
    await this.mailQueue.add(MailJobName.SEND_RESET_PASSWORD, { email, resetPasswordUrl, username });
  }

  async sendVerifyEmailLink(email: string, verifyEmailUrl: string, username: string) {
    await this.mailQueue.add(MailJobName.SEND_VERIFY_EMAIL, { email, verifyEmailUrl, username });
  }
}
