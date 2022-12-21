import { LoggerService } from "@vactory/services/logger.service";

export class Log {
  static info = (message) => {
    LoggerService.info(message, `AUTH`);
  };

  static debug = (message) => {
    LoggerService.debug(message, `AUTH`);
  };

  static warn = (message) => {
    LoggerService.warn(message, `AUTH`);
  };

  static error = (message) => {
    LoggerService.error(message, `AUTH`);
  };
}
