import { Platform } from 'react-native';
import Constants from 'expo-constants';

export class AppInfoService {

  static getDefaultLanguage = () => {
    return Constants.expoConfig.extra.defaultLanguage;
  };

  static getAvailableMenus = () => {
    return Constants.expoConfig.extra.menus;
  };

  static getVersion = () => {
    return Constants.manifest.version;
  };

  static getBuildNumber = () => {
    return Platform.select({
      ios: Constants.manifest.ios.buildNumber,
      android: Constants.manifest.android.versionCode,
      web: '',
    });
  };
}