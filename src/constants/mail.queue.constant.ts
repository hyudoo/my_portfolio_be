export const MAIL_QUEUE = "mail";

export enum MailJobName {
  SEND_VERIFY_EMAIL = "send-verify-email",
  SEND_RESET_PASSWORD = "send-reset-password",
  SEND_CONTACT_NOTIFICATION = "send-contact-notification",
  SEND_SUBSCRIBE_CONFIRMATION = "send-subscribe-confirmation",
}
