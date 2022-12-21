import { API_URL } from "@env";
import jwt_decode from "jwt-decode";
import { formatFormData } from "./utils";
import { getLanguage } from "@vactory/i18n";

export default function (options) {
  return {
    id: "drupal",
    name: "Drupal",
    type: "credentials",
    authorize: async (config) => {
      const locale = getLanguage();
      const requestParams = {
        grant_type: "password",
        client_id: options.clientId,
        client_secret: options.clientSecret,
        username: config.username,
        password: config.password,
      };

      // Get access token from Drupal.
      let response = null;
      try {
        response = await fetch(`${API_URL}/${locale}/oauth/token`, {
          method: "POST",
          body: formatFormData(requestParams),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      } catch (e) {
        return Promise.reject(e);
      }

      if (!response.ok) {
        const errors = await response.json();
        return Promise.reject(errors);
      }

      const data = await response.json();

      if (response.ok && data?.access_token) {
        const decoded = jwt_decode(data.access_token);
        data.profile = decoded.profile;

        // Blocked user.
        if (data?.profile?.isBlocked && data?.profile?.isBlocked === true) {
          return Promise.reject("User blocked");
        }

        return Promise.resolve({
          id_token: undefined,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
          scope: undefined,
          profile: data.profile,
          expires_at: parseInt(Date.now() / 1000 - 2 + data.expires_in), // minus 2 seconds for request time :(
          provider: "drupal",
        });
      }

      return Promise.reject(
        "Drupal authentification failed for an unknown raison"
      );
    },
    refreshToken: async (user) => {
      const locale = getLanguage();
      const requestParams = {
        grant_type: "refresh_token",
        client_id: options.clientId,
        client_secret: options.clientSecret,
        refresh_token: user.refresh_token,
      };

      // Get access token from Drupal.
      const response = await fetch(`${API_URL}/${locale}/oauth/token`, {
        method: "POST",
        body: formatFormData(requestParams),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        return Promise.reject("RefreshAccessTokenError");
      }

      const refreshedTokens = await response.json();
      const decoded = jwt_decode(refreshedTokens.access_token);

      return Promise.resolve({
        ...user,
        profile: decoded.profile,
        access_token: refreshedTokens.access_token,
        expires_at: parseInt(
          Date.now() / 1000 - 2 + refreshedTokens.expires_in
        ), // minus 2 seconds for request time :(
        refresh_token: refreshedTokens.refresh_token ?? user.refresh_token, // Fall back to old refresh token
      });
    },
    options,
  };
}
