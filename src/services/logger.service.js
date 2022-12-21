import {
  logger as _reactive_native_logger,
  consoleTransport,
} from "react-native-logs";

const defaultConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: "debug",
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
};

const log = _reactive_native_logger.createLogger(defaultConfig);

export class LoggerService {
  static info = (message, module = "vactory") => {
    log.info(`[${module}]:`, message);
  };

  static debug = (message, module = "vactory") => {
    log.debug(`[${module}]:`, message);
  };

  static warn = (message, module = "vactory") => {
    log.warn(`[${module}]:`, message);
  };

  static error = (message, module = "vactory") => {
    log.error(`[${module}]:`, message);
  };
}