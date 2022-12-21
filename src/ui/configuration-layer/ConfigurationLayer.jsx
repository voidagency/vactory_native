import React, { useEffect } from "react";
import { Layout, Text } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { AppReloadService } from "../../services/app-reload.service";
import { useI18n } from "../../hooks";

export const ConfigurationLayer = () => {
  const { t } = useI18n();
  const navigation = useNavigation();

  // Lock back button && hide header
  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    navigation.setOptions({
      headerShown: false,
      swipeEnabled: false,
    });

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    let reloadTimer = setTimeout(() => AppReloadService.reload(), 500);
    return () => {
      clearTimeout(reloadTimer);
    };
  }, []);
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text category="h4" appearance="hint" status="info">
        {t("RN:Please wait while we apply your changes.")}
      </Text>
    </Layout>
  );
};
