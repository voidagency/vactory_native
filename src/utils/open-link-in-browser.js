import { Linking } from "react-native";

export function openLinkInBrowser(url) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}