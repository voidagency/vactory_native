// import { Updates } from 'expo';
import { NativeModules } from "react-native";
import { LoggerService } from "./logger.service"

export class AppReloadService  {

  static reload = () => {
    LoggerService.info("Reloading the app", ['AppReloadService'])
    // Updates.reload();
    NativeModules.DevSettings.reload();
  };
}
