import { FE_APP_URL } from "../constants/env-key.constant";
import { Locale } from "../enums/locale.enum";
import { config } from "dotenv";
config();

const feAppUrl = process.env[FE_APP_URL];

export const getResetPasswordUrl = (token: string, locale: Locale = Locale.En) => {
  return `${feAppUrl}/${locale}/reset-password?token=${token}`;
};

export const getVerifyEmailUrl = (token: string, locale: Locale = Locale.En) => {
  return `${feAppUrl}/${locale}/verify-email?token=${token}`;
};

export const getSubscribeConfirmUrl = (code: string, locale: Locale = Locale.En) => {
  return `${feAppUrl}/${locale}/subscribe/confirm?token=${code}`;
};

export const getUnsubscribeUrl = (code: string, locale: Locale = Locale.En) => {
  return `${feAppUrl}/${locale}/unsubscribe?token=${code}`;
};
