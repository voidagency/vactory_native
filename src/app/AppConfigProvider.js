import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ErrorHandler,
  ConfigurationScreen,
  SplashImage,
  TextStatusMessage,
  TextWarningMessage,
  Unauthorized,
  NotFound,
  SystemError,
  ConfigurationLayer,
  Header,
  DrawerContent
} from "@vactory/ui";
import { AppConfigContext } from "./AppConfigContext";

import { DEFAULT_APP_FONTS } from "./constants";

export function AppConfigProvider({ children, appConfig }) {
  const [contextData, ] = useState({
    ui: {
      components: {
        ErrorHandler,
        ConfigurationScreen,
        SplashImage,
        TextStatusMessage,
        TextWarningMessage,
        Unauthorized,
        NotFound,
        SystemError,
        ConfigurationLayer,
        Header,
        DrawerContent,
        ...appConfig?.ui?.components
      },
    },
    fonts: {
      ...Ionicons.font,
      ...DEFAULT_APP_FONTS,
      ...appConfig?.fonts
    },
    navigation: {
      initialRoute: appConfig?.navigation?.initialRoute ? appConfig?.navigation?.initialRoute : "WelcomeScreen",
    },
    screens: appConfig?.navigation?.screens ? appConfig?.navigation?.screens : [],
  });

  const getScreens = () => {
    return contextData.screens;
  };

  const getUiComponent = (name) => {
    return contextData.ui.components[name];
  };

  const getFonts = () => {
    return contextData.fonts;
  };


  const getNavigation = () => {
    return contextData.navigation;
  };

  return (
    <AppConfigContext.Provider
      value={{
        getUiComponent,
        getFonts,
        getNavigation,
        getScreens,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
}
