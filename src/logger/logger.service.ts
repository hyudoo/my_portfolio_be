import { Injectable, LoggerService } from "@nestjs/common";
import { createLogger, format, Logger, transports } from "winston";
import chalk from "chalk";
import { datetime } from "../utils/datetime.util";

@Injectable()
export class AppLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: "debug",
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize({ all: true }),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.printf(({ context, level, message, time }) => {
              const strApp = chalk.green("[Nest]");
              const strContext = chalk.yellow(`[${String(context)}]`);
              return `${strApp} - ${String(time)} ${level} ${strContext} : ${String(message)}`;
            }),
          ),
        }),
        new transports.File({
          dirname: "logs",
          filename: "error.log",
          level: "debug",
          format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), format.json()),
        }),
      ],
    });
  }

  log(message: string, context: string) {
    const time = datetime().format("YYYY-MM-DD HH:mm:ss");
    this.logger.log("info", message, { context, time });
  }

  error(message: string, context: string) {
    this.logger.error("error", message, context);
  }

  warn(message: string, context: string) {
    this.logger.warn("warn", message, context);
  }

  debug?(message: string, context: string) {
    this.logger.debug("debug", message, context);
  }

  verbose?(message: string, context: string) {
    this.logger.info("verbose", message, context);
  }

  fatal?(message: string, context: string) {
    this.logger.error("fatal", message, context);
  }
}
