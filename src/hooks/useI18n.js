import { I18nManager } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { useNavigation } from "@react-navigation/native";
// import { useAppStore } from "../core/state/appState"
import { i18n, getLanguage } from "@vactory/i18n"

export const useI18n = () => {
  const navigation = useNavigation();
  const [language, setLang] = useMMKVString("local");
  // const showConfigurationLayer = useAppStore((state) => state.showConfigurationLayer)

  const t = (...args) => {
    return i18n.t(...args) || args[0];
  };

  const changeLocale = (lang) => {
    // Bailout if the same language.
    if (lang === language) {
      return;
    }

    // Show layer.
    // showConfigurationLayer();
    // Save language to storage.
    setLang(lang);
    if (lang === "ar") {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }

    navigation.navigate("ConfigurationLayer");
    
  };

  return { t, currentLocale: language || getLanguage(), changeLocale };
};
