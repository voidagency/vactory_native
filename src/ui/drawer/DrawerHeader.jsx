import React from "react";
import { Layout, Text, Avatar } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import { SafeAreaLayout } from "../SafeAreaLayout";
import { DEFAULT_APP_DRAWER_LOGO } from "@vactory/app/constants";

// todo: icon.png consts
export const DrawerHeader = () => (
  <SafeAreaLayout insets="top" level="2">
    <Layout style={styles.header} level="2">
      <View style={styles.logoContainer}>
        <Avatar size="giant" source={DEFAULT_APP_DRAWER_LOGO} />
        <Text style={styles.appName} category="h6">
          Vactory Native
        </Text>
      </View>
    </Layout>
  </SafeAreaLayout>
);

const styles = StyleSheet.create({
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appName: {
    marginHorizontal: 16,
  },
});
