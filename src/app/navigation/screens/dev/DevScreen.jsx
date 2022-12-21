import * as React from "react";
import { useNavigation } from "@react-navigation/native";
// import MenuIcon from "../components/MenuIcon";
import { useEffect } from "react";
import { Button, ButtonGroup, Layout, Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import { useI18n, useAuth, useRTLDirection, memoryStorage } from "@vactory";
import * as Linking from "expo-linking";

export default function DevScreen() {
  const { isAuthenticated, profile } = useAuth();
  const navigation = useNavigation();
  const [counter, setCounter] = React.useState(0);
  const { t, changeLocale, currentLocale } = useI18n();
  const isRTL = useRTLDirection()

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => <MenuIcon />,
  //   });
  // });

  return (
    <Layout style={styles.container} level="1">
      <Button
        style={{ marginVertical: 8 }}
        onPress={() => setCounter(counter + 1)}
      >
        Test translation (this will change): {t("Sign in")}
        {/* {t("Please wait while we apply your changes.")} */}
        {/* {t("RN.configuration.layer.wait.message")} */}
      </Button>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "tomato",
          alignItems: "center",
        }}
      >
        <Text style={styles.text}>Current language {currentLocale}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "tomato",
          alignItems: "center",
        }}
      >
        <Text style={styles.text}>IS RTL: {String(isRTL)}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "tomato",
          alignItems: "center",
        }}
      >
        <Text style={styles.text}>
          Auth status:{" "}
          {isAuthenticated ? `logged in as ${profile.full_name}` : "logged out"}
        </Text>
      </View>

      <Button
        style={{ marginVertical: 8 }}
        onPress={() => memoryStorage.clearAll()}
      >
        Clear Cache
      </Button>

      <View style={styles.controlContainer}>
        <ButtonGroup style={styles.buttonGroup} status="control">
          <Button onPress={() => changeLocale("en")}>English</Button>
          <Button onPress={() => changeLocale("fr")}>French</Button>
          <Button onPress={() => changeLocale("ar")}>Arabe</Button>
        </ButtonGroup>
      </View>

      <Button
        style={{ marginVertical: 8 }}
        onPress={() => navigation.navigate("NotFound")}
      >
        Go to 404
      </Button>
      <Button
        style={{ marginVertical: 8 }}
        onPress={() => Linking.openURL("myapp://facebook/callback")}
      >
        Open myapp://facebook/callback
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: "100%",
    flexDirection: "column",
    // flex: 1,
    backgroundColor: "#eeeee4",
  },
  text: {
    fontWeight: "bold",
    backgroundColor: "pink",
    // flex: 1,
    // width: '70%',
    // marginHorizontal: 8,
    // textDirection: "right",
    // width: '100%',
    // flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGroup: {
    margin: 2,
  },
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3366FF",
  },
});
