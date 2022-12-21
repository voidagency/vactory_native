import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, Divider, Icon } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

import { SafeAreaLayout } from "../SafeAreaLayout";
import { AppInfoService } from "@vactory/services";

export const DrawerFooter = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaLayout insets="bottom">
      <React.Fragment>
        <Divider />
        <View style={styles.footer}>
          <Text>{`Version ${AppInfoService.getVersion()}`}</Text>
          <Button
            status="danger"
            accessoryLeft={<Icon name="settings-2-outline" />}
            onPress={() => navigation.navigate("DevMenu")}
            style={{
              marginTop: 10,
              width: "100%",
            }}
          >
            DEV TOOLS
          </Button>
        </View>
      </React.Fragment>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
});
