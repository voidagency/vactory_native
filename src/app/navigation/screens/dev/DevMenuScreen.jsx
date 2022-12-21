import React from "react";
import { StyleSheet } from "react-native";
import {
  Icon,
  Menu,
  MenuItem,
  Layout,
  BottomNavigation,
  BottomNavigationTab,
  Text,
} from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAppConfig } from "@vactory/hooks";

import UserScreen from "./UserScreen"; // TODO

const ForwardIcon = (props) => <Icon {...props} name="arrow-ios-forward" />;

const ExtraScreensScreen = () => {
  const { getScreens } = useAppConfig();
  const navigation = useNavigation();
  const screens = getScreens();
  const menuItems = screens.map(({ name }, index) => {
    return (
      <MenuItem
        key={index}
        title={name}
        onPress={() => navigation.navigate(name)}
      />
    );
  });

  if (screens.length <= 0) {
    return (
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h4">No custom screens defined</Text>
        <Text category="p1" style={{ textAlign: "center" }}>
          Open <Text status="primary">`App.js`</Text> and add{" "}
          <Text status="danger">`setScreens`</Text> in your Configurator
          component
        </Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="1">
      <Menu style={styles.menu}>{menuItems}</Menu>
    </Layout>
  );
};

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="Menu" icon={<Icon name="home-outline" />} />
    <BottomNavigationTab
      title="Account"
      icon={<Icon name="person-outline" />}
    />
    <BottomNavigationTab
      title="Extra Screens"
      icon={<Icon name="bulb-outline" />}
    />
  </BottomNavigation>
);

export default function DevMenusScreen() {
  return (
    <Navigator tabBar={(props) => <BottomTabBar {...props} />}>
      <Screen name="DevLab" component={DevMenusListScreen} />
      <Screen name="DevUserAccount" component={UserScreen} />
      <Screen name="DevExtraScreens" component={ExtraScreensScreen} />
    </Navigator>
  );
}

function DevMenusListScreen() {
  const navigation = useNavigation();

  return (
    <Layout style={styles.container} level="1">
      <Menu style={styles.menu}>
        <MenuItem
          title="Debug"
          accessoryLeft={ForwardIcon}
          onPress={() => navigation.navigate("Dev")}
        />
        <MenuItem
          title="NotFound"
          accessoryLeft={ForwardIcon}
          onPress={() => navigation.navigate("NotFound")}
        />
        <MenuItem
          title="Unauthorized"
          accessoryLeft={ForwardIcon}
          onPress={() => navigation.navigate("Unauthorized")}
        />
        <MenuItem
          title="SystemError"
          accessoryLeft={ForwardIcon}
          onPress={() => navigation.navigate("SystemError")}
        />
        <MenuItem
          title="ConfigurationLayer"
          accessoryLeft={ForwardIcon}
          onPress={() => navigation.navigate("ConfigurationLayer")}
        />
        <MenuItem
          title="WelcomeScreen"
          accessoryLeft={ForwardIcon}
          onPress={() => navigation.navigate("WelcomeScreen")}
        />
      </Menu>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
  menu: {
    flex: 1,
    margin: 8,
  },
});
