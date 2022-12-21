import * as React from "react";
import { StateView } from "../../state-view";
import { SafeAreaView } from "react-native";

const ErrorImage = require("./error.png");

export const SystemError = ({ resetErrorBoundary = () => {} }) => {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <StateView
        enableButton
        buttonText="Try again"
        title="There’s been a glitch…"
        description="An error has occured and we're working to fix the problem!. You can press the Try again button below to reload the app."
        onPress={resetErrorBoundary}
        imageSource={ErrorImage}
        titleStyle={{
          color: "#3ebcf1",
        }}
        buttonContainerStyle={{
          backgroundColor: "#3ebcf1"
        }}
      />
    </SafeAreaView>
  );
}
