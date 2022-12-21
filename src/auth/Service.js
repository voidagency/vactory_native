import { UserManager } from "./UserManager"
import { UserStore } from "./UserStore"
import LocalProvider from "./providers/local"
import FacebookProvider from "./providers/facebook"
import DrupalProvider from "./providers/drupal"

// todo: create an initializeAuth function & expose ENV
const settings = {
  automaticSilentRenew: true,
  // accessTokenExpiringNotificationTime: 10, // The number of seconds before an access token is to expire to raise the accessTokenExpiring event.
  accessTokenExpiringNotificationTime: 20, // The number of seconds before an access token is to expire to raise the accessTokenExpiring event.
  providers: [
    () => LocalProvider(),
    () => FacebookProvider({
      clientId: "1247694299299825",
      projectNameForProxy: "@mehdi.najeddine/vactory_native",
      auth_type: "reauthenticate"
    }),
    () => DrupalProvider({
      clientId: "1A1c8976-d72d-4f0f-b00f-ea77e67dfv60",
      clientSecret: "noop",
    }),
  ]
};

export const AuthManagerService = new UserManager(settings);
export const AuthManagerProvidersRefresh = () => {
  AuthManagerService.refreshProviders(settings.providers)
}

export const AuthStoreService = UserStore
