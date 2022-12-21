import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { useUserStore } from "./UserStore";
import { AuthManagerService } from "./Service";
import { AppReloadService } from "@vactory/services/app-reload.service";
import { isEmpty } from "@vactory/utils";
import { useI18n } from "@vactory/hooks/useI18n";

export const useAuth = () => {
  const [user, setUser] = useState(useUserStore.getState().user);
  const navigation = useNavigation();
  const { t } = useI18n();

  useEffect(() => {
    const unsub = useUserStore.subscribe((state) => {
      setUser(state.user);
    });
    return () => {
      unsub();
    };
  }, [user]);

  return {
    isAuthenticated: user !== null,
    accessToken: user?.access_token ? user?.access_token : null,
    profile: user?.profile ? user?.profile : null,
    goToSignInScreen: ({ callbackScreen = "" } = {}) => {
      // TODO: User screen should a configuration
      navigation.navigate("User", {
        callbackScreen,
      });
    },
    goToSignUpScreen: ({ callbackScreen = "" } = {}) => {
      // TODO: User screen should a configuration
      navigation.navigate("User", {
        callbackScreen,
      });
    },
    goToResetPasswordScreen: ({ callbackScreen = "" } = {}) => {
      // TODO: User screen should a configuration
      navigation.navigate("User", {
        callbackScreen,
      });
    },
    signOut: ({ callbackScreen = "", reloadApp = false } = {}) => {
      AuthManagerService.removeUser();

      if (reloadApp) {
        AppReloadService.reload();
        return;
      }

      if (!isEmpty(callbackScreen)) {
        navigation.navigate(callbackScreen);
      }
    },
    signIn: async (
      providerId = "",
      { callbackScreen = "", ...signInOptions } = {}
    ) => {
      const { user, hasError, error } = await AuthManagerService.signIn(
        providerId,
        signInOptions
      );

      if (hasError) {
        return Promise.reject(error);
      }

      if (!isEmpty(callbackScreen)) {
        navigation.navigate(callbackScreen);
      }

      if (user) {
        return Promise.resolve(user);
      }

      // Auth crashed: cancel or dismiss
      showMessage({
        message: t("RN:Opération annulée."),
        type: "warning",
        position: "bottom",
      });
    },
  };
};
