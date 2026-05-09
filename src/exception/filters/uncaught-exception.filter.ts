import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { AppLogger } from "../../logger/logger.service";
import { ErrorCode, errorMessages } from "../error-messages";

@Catch()
export class UncaughtExceptionFilter implements ExceptionFilter {
  constructor(private logger: AppLogger) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    this.logger.error(
      `Uncaught exception: ${exception.constructor?.name}\n${exception?.message ?? exception}\n${exception?.stack ?? ""}`,
      "ExceptionFilter",
    );

    res.status(500).json({
      code: ErrorCode.UNKNOWN,
      message: errorMessages[ErrorCode.UNKNOWN],
      error: exception,
      errorMessage: exception.message,
    });
  }
}
