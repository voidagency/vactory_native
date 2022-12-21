import * as React from "react";
import { StateView } from "@vactory/ui";
import { SafeAreaView } from "react-native";
import { openLinkInBrowser } from "@vactory/utils";

const ErrorImage = require("./error.png");

export default function WelcomeScreen() {

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <StateView
        title={"Welcome"}
        description={`Oh hey, you've successfully installed Vactory!. ${"\n"} This is the default welcoming screen, you can configure yours by setting initialRoute using the configurator. ${"\n"} ${"\n"} Open the burger menu and discorver new Drupal experience. Or if you like taking risks press Dev Tools.`}
        imageSource={ErrorImage}
        enableButton={true}
        buttonText={"Read the docs"}
        imageStyle={{
          height: 300,
        }}
        descriptionStyle={{
          fontWeight: "bold",
        }}
        onPress={() =>
          openLinkInBrowser("https://docs.vactory.lecontenaire.com/")
        }
      />
    </SafeAreaView>
  );
}
