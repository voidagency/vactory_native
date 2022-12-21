import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { StateView } from "../../state-view";
import { useAppConfig } from "@vactory/hooks";

const ErrorImage = require("./error.png");

export const NotFound = () => {
  const navigation = useNavigation();
  const { getNavigation } = useAppConfig();

  // Lock back button
  useEffect(() => {
    const backAction = () => {
      return true;
    };

    let backHandler;
    // Lock Back button when entering screen.
    navigation.addListener("focus", () => {
      backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
    });

    // Unlock Back button when leaving screen.
    const unsubscribe_leave = navigation.addListener("blur", () => {
      backHandler.remove();
    });

    return () => {
      unsubscribe_leave();
    };
  }, [navigation]);

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <StateView
          enableButton
          buttonText="Refresh"
          title="No Content"
          description="Oups... Il semblerait que cette page n'existe pas..."
          onPress={() => navigation.navigate(getNavigation().initialRoute)}
          imageSource={ErrorImage}
          titleStyle={{
            color: "#3ebcf1",
          }}
          buttonContainerStyle={{
            backgroundColor: "#3ebcf1",
          }}
        />
      </SafeAreaView>
    </>
  );
};
