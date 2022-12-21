import { StyleSheet, View } from "react-native";
import { STATUS_BAR_HEIGHT } from "@vactory/utils"


export const StatusBarUnderlay = () => (
  <View style={styles.statusBarUnderlay} />
);

const styles = StyleSheet.create({
  statusBarUnderlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: STATUS_BAR_HEIGHT,
    backgroundColor: "white",
  },
});
