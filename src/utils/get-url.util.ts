import { FE_APP_URL } from "../constants/env-key.constant";
import { config } from "dotenv";
config();

const feAppUrl = process.env[FE_APP_URL];

export const getResetPasswordUrl = (email: string, digitsCode: string) => {
  return `${feAppUrl}/auth/reset-password?email=${email}&code=${digitsCode}`;
};

export const getVerifyEmailUrl = (email: string, digitsCode: string) => {
  return `${feAppUrl}/verify-email?email=${email}&code=${digitsCode}`;
};
