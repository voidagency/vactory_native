import { ResponseType, makeRedirectUri, AuthRequest } from "expo-auth-session";
import { Log } from "../Log.js";
import {
  getOrCreateDrupalUserinfoByProvider,
  applyRequiredScopes,
} from "./utils";

// todo: try catch
// todo: refresh
export default function (options) {
  return {
    id: "facebook",
    name: "Facebook",
    type: "oauth",
    authorize: async (config) => {
      config.scopes = [];
      const discovery = {
        authorizationEndpoint: "https://www.facebook.com/v6.0/dialog/oauth",
        tokenEndpoint: "https://graph.facebook.com/v6.0/oauth/access_token",
      };

      const settings = {
        // These are required to work properly which is a reasonable default.
        minimumScopes: ["public_profile", "email"],
      };

      const scopes = applyRequiredScopes(config.scopes, settings.minimumScopes);

      const extraParams = {
        locale: "fr_FR", // todo could not find any info about this one
        enable_profile_selector: true,
        return_scopes: true,
        auth_type: options?.auth_type || "rerequest", // https://developers.facebook.com/docs/reference/javascript/FB.login/#options
      };

      const redirectUri = makeRedirectUri({
        // The redirect URI should be created using fb + client ID on native.
        // native: `fb${clientId}://authorize`,
        useProxy: true,
        projectNameForProxy: options.projectNameForProxy,
        // scheme: 'myapp',
        // path: "facebook/callback",
      });

      const authorizationRequest = new AuthRequest({
        clientId: options.clientId,
        redirectUri: redirectUri,
        responseType: ResponseType.Token,
        scopes: scopes,
        extraParams: extraParams,
        prompt: true,
      });

      if (authorizationRequest) {
        console.info(
          "Make sure add this url to your authorized redirect urls on your Facebook app: " +
            authorizationRequest.redirectUri
        );
      }

      // Get the URL to invoke
      const url = await authorizationRequest.makeAuthUrlAsync(discovery);
      Log.info("Facebook Auth Request: " + decodeURIComponent(url));

      // Prompt for an auth code
      const authorizationResponse = await authorizationRequest.promptAsync(
        discovery,
        {
          useProxy: true,
          projectNameForProxy: options.projectNameForProxy,
        }
      );

      if (
        authorizationResponse?.type === "success" &&
        authorizationResponse.authentication
      ) {
        Log.info("Facebook Auth Request: Success");
        const tokenInfo = authorizationResponse.authentication;

        const userInfoResponse = await getOrCreateDrupalUserinfoByProvider(
          tokenInfo.accessToken,
          "facebook"
        );
        const userInfo = await userInfoResponse.json();

        return Promise.resolve({
          id_token: tokenInfo.idToken,
          access_token: tokenInfo.accessToken,
          refresh_token: tokenInfo.refreshToken,
          token_type: tokenInfo.tokenType,
          scope: tokenInfo.scope, // todo why undefined > i'm sending return_scopes ?
          profile: userInfo,
          expires_at: parseInt(tokenInfo.issuedAt + tokenInfo.expiresIn), // 2 months see https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/
          provider: "facebook",
        });
      }

      return Promise.reject(null);
    },
    options,
  };
}
