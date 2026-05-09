import { BullRootModuleOptions } from "@nestjs/bullmq";
import { config } from "dotenv";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../constants/env-key.constant";
import Redis from "ioredis";

config();

const options = {
  host: process.env[REDIS_HOST],
  port: Number(process.env[REDIS_PORT] ?? 6379),
  password: process.env[REDIS_PASSWORD],
};

export const redisClient = new Redis(options);

export const redisOptions: BullRootModuleOptions = {
  connection: options,
};
