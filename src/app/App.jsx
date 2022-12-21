import React from "react";
import { StatusBar } from "expo-status-bar";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import FlashMessage from "react-native-flash-message";
import { getLanguage, initDictionary } from "@vactory/i18n";
import { MenuProvider } from "@vactory/context";
import { AppLoading, LoadFontsTask } from "./AppLoading";
import { useTheme } from "@vactory/hooks"
import {
  AppInfoService,
  MenusService,
  TranslationsService,
  AuthManagerService,
} from "@vactory/services";

import { defaultThemeConfig, defaultMappingConfig } from "@vactory/theme";
import { AppConfigProvider } from "./AppConfigProvider";
import { useAppConfig } from "./AppConfigContext";
import AppNavigation from "./AppNavigation";

import { DEFAULT_APP_SPLASH_SCREEN } from "./constants"

// Auth, watch for token expiration.
AuthManagerService.events.addAccessTokenExpired(function () {
  // Token expired and we tried renew it but it failed.
  // Logout please.
  AuthManagerService.removeUser();
  // todo: reload app and maybe show a logout layer or let user handle this.
});

const APP_MENUS = AppInfoService.getAvailableMenus();

const defaultConfig = {
  mapping: defaultMappingConfig,
  theme: defaultThemeConfig,
};

const Splash = ({ loading }) => {
  const { getUiComponent } = useAppConfig();
  const SplashImage = getUiComponent("SplashImage");

  return (
    <SplashImage
      loading={loading}
      source={DEFAULT_APP_SPLASH_SCREEN} // todo: conf and fallback to default.
    />
  );
};

export const VactoryApp = ({
  appConfig = {},
  ...appProps
}) => {
  return (
    <AppConfigProvider appConfig={appConfig}>
        <AppLoad {...appProps} />
    </AppConfigProvider>
  );
};

const AppLoad = (appProps) => {
  const { getFonts } = useAppConfig();
  const fonts = getFonts();

  const loadingTasks = [
    async () => {
      try {
        await LoadFontsTask(fonts);
      } catch (e) {
        console.error(e);
        return Promise.reject(e);
      }
      return Promise.resolve([]);
    },
    // () => LoadAssetsTask([Constants.manifest.splash.image]),
    // () => getTranslations().then((result) => ["translations", result]),
    async () => {
      const result = await TranslationsService.getTranslations();
      initDictionary(result);
      return Promise.resolve([]);
    },
    async () => {
      const locale = getLanguage();
      const result_2 = await MenusService.getMenus(APP_MENUS, locale);
      return ["menus", result_2];
    },
  ];

  return (
    <AppLoading
      tasks={loadingTasks}
      initialConfig={defaultConfig}
      placeholder={Splash}
    >
      {(props) => <App {...props} {...appProps} />}
    </AppLoading>
  );
};

// menus is injected using Tasks, see above.
const App = ({
  theme,
  mapping,
  menus = [],
}) => {
  const { theme: themeMode } = useTheme();
  const { getUiComponent } = useAppConfig();
  const ErrorHandler = getUiComponent("ErrorHandler");

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        customMapping={mapping}
        theme={{ ...eva[themeMode], ...theme }}
      >
        <ErrorHandler>
          <MenuProvider menus={menus}>
            <AppNavigation />
            <FlashMessage position="bottom" />
            <StatusBar />
          </MenuProvider>
        </ErrorHandler>
      </ApplicationProvider>
    </>
  );
};
