import * as Linking from 'expo-linking';
import { getStateFromPath } from "@react-navigation/native"

export default {
  prefixes: [Linking.makeUrl('/'), 'https://auth.expo.io/@mehdi.najeddine/vactory_native'], // todo
  config: {
    screens: {
      Root: {
        screens: {
          DevMenu: 'facebook/callback', // todo
        },
      },
      NotFound: '*',
    },
  },
  getStateFromPath(path, config) {
    // https://docs.expo.dev/versions/latest/sdk/auth-session/#filtering-out-authsession-events-in-linking-handlers
    if (path.includes("expo-auth-session")) {
      return;
    }
    return getStateFromPath(path,config)
  }
};
