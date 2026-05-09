import { Module } from "@nestjs/common";
import { AxiosErrorFilter } from "./filters/axios-error.filter";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { UnauthorizedExceptionFilter } from "./filters/unauthorized-exception.filter";
import { UncaughtExceptionFilter } from "./filters/uncaught-exception.filter";
import { AppLogger } from "../logger/logger.service";

@Module({
  providers: [UncaughtExceptionFilter, AxiosErrorFilter, UnauthorizedExceptionFilter, HttpExceptionFilter],
  exports: [UncaughtExceptionFilter, AxiosErrorFilter, UnauthorizedExceptionFilter, HttpExceptionFilter],
})
export class ExceptionModule {}
