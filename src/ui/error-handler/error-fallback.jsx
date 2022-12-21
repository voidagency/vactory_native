import * as React from "react";
import { StateView } from "../state-view";
import { SafeAreaView } from "react-native";
import { useI18n } from "@vactory/hooks"

const ErrorImage = require("./error.png");

export default function ErrorFallback({ error, resetErrorBoundary }) {
  const { t } = useI18n()
  console.error(error)
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <StateView
        enableButton
        buttonText={t("RN:Try again")}
        title={t("RN:There’s been a glitch…")}
        description={t("RN:An error has occured and we're working to fix the problem!. You can press the Try again button below to reload the app.")}
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
