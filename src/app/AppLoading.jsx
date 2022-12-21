import React, { useCallback, useEffect, useState } from "react";
// import { View } from "react-native";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoggerService } from "@vactory/services";
import { showErrorMessage } from "@vactory/ui";
// import { Text } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch((e) => {
  console.log(e);
  /* reloading the app might trigger some race conditions, ignore them */
});

export const LoadFontsTask = async (fonts) => {
  return Font.loadAsync(fonts);
};

export const LoadAssetsTask = (assets) => {
  const tasks = assets.map((source) => {
    return Asset.fromModule(source).downloadAsync().then();
  });

  return Promise.all(tasks).then(() => null);
};

export const AppLoading = (props) => {
  const [appIsReady, setAppIsReady] = useState(false);
  const loadingResult = React.useRef(props.initialConfig || {});
  // const [, setTick] = useState(0)

  const saveTaskResult = (result) => {
    if (result && typeof result[0] !== "undefined") {
      loadingResult.current[result[0]] = result[1];
    }
  };

  const startTasks = async () => {
    return Promise.all(props.tasks.map((task) => task().then(saveTaskResult)));
  };

  useEffect(() => {
    async function prepare() {
      try {
        await startTasks();
      } catch (e) {
        LoggerService.error(e, "app.loading.jsx:prepare");
        showErrorMessage("Something went wrong while loading the app.");
        // handleError(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare() // make sure to catch any error
      .catch(console.error);
  }, []);

  const onLayoutRootView = useCallback(async () => {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      console.log("Hide SplashScreen");
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        LoggerService.error(
          e,
          "app.loading.jsx:onLayoutRootView:hideSplashScreen"
        );
      }
  }, [appIsReady]);

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      {props.placeholder && props.placeholder({ loading: !appIsReady })}
      {appIsReady && props.children(loadingResult.current)}
    </SafeAreaProvider>
  );
};

AppLoading.defaultProps = {
  tasks: [],
  initialConfig: {},
};
