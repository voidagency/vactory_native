import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";

const controlContainerMap = {
  'control' : 'controlContainer',
  'warning' : 'warningContainer',
}

export const TextStatusMessage = ({ status = "control", children }) => (
  <View style={styles[controlContainerMap[status]]}>
    <Text style={styles.text}>
      {children}
    </Text>
  </View>
);

export const TextWarningMessage = ({ children }) => {
  return <TextStatusMessage status="warning">{children}</TextStatusMessage>;
};

const styles = StyleSheet.create({
  text: {
    margin: 4,
    color: "#FFF"
  },
  controlContainer: {
    borderRadius: 4,
    margin: 4,
    padding: 4,
    backgroundColor: "#3366FF",
  },
  warningContainer: {
    borderRadius: 4,
    margin: 4,
    padding: 4,
    backgroundColor: "#ffcc5c",
  },
});
