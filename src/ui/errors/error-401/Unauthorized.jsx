import * as React from "react";
import { StateView } from "../../state-view";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppConfig } from "@vactory/hooks";
const ErrorImage = require("./error.png");

export const Unauthorized = () => {
  const navigation = useNavigation();
  const { getNavigation } = useAppConfig();


  return (
    <>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <StateView
          enableButton={true}
          title="Access denied"
          buttonText="Refresh"
          description="An error has occured and we're working to fix the problem!. You can press the Try again button below to reload the app."
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
}
