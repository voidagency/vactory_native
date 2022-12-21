import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTheme } from "@ui-kitten/components";

import NotFoundScreen from "./navigation/screens/errors/NotFoundScreen";
import UnauthorizedScreen from "./navigation/screens/errors/UnauthorizedScreen";
import SystemErrorScreen from "./navigation/screens/errors/SystemErrorScreen";
import ConfigurationLayerScreen from "./navigation/screens/configuration-layer/ConfigurationLayerScreen";
import { RouterScreen } from "./navigation/screens/NodeRouteScreen";
import DrupalMenuScreen from "./navigation/screens/dev/DrupalMenusScreen";
import DevScreen from "./navigation/screens/dev/DevScreen";
import DevMenuScreen from "./navigation/screens/dev/DevMenuScreen";
import WelcomeScreen from "./navigation/screens/welcome/WelcomeScreen";
import { useAppConfig } from "./AppConfigContext";

import LinkingConfiguration from "./navigation/LinkingConfiguration";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation(props) {
  const { theme } = useTheme();
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={theme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator {...props} />
    </NavigationContainer>
  );
}

const DrawerContent = (props) => {
  const { getUiComponent } = useAppConfig();
  const DefauDrawerContent = getUiComponent("DrawerContent");

  return (
    <DefauDrawerContent {...props} />
  );
};

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
// const Stack = createStackNavigator();
const Stack = createStackNavigator();

const { Navigator, Screen } = createDrawerNavigator();

const DrawerNavigator = () => {
  const { getNavigation, getUiComponent, getScreens } = useAppConfig();
  const Header = getUiComponent("Header");

  const screens = getScreens().map(({name, component}, index) => {
    return <Screen key={index} name={name} component={component} />
  });

  return (
    <Navigator
      initialRouteName={getNavigation().initialRoute}
      screenOptions={{
        header: ({ options }) => (
          <Header drawerOptions={options} />
        ),
      }}
      drawerType="slide"
      backBehavior="history"
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Screen name="Menus" component={DrupalMenuScreen} />
      <Screen name="DevMenu" component={DevMenuScreen} />
      <Screen name="Dev" component={DevScreen} />
      <Screen name="NotFound" component={NotFoundScreen} />
      <Screen name="Unauthorized" component={UnauthorizedScreen} />
      <Screen name="SystemError" component={SystemErrorScreen} />
      <Screen name="ConfigurationLayer" component={ConfigurationLayerScreen} />
      <Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Screen name="Router" component={RouterScreen} />
      {screens}
    </Navigator>
  );
};

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}
