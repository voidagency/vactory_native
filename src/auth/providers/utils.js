import { API_URL } from "@env";
import { getLanguage } from "@vactory/i18n";

export const applyRequiredScopes = (scopes = [], requiredScopes) => {
  // Add the required scopes for returning profile data.
  // Remove duplicates
  return [...new Set([...scopes, ...requiredScopes])];
};

export const getOrCreateDrupalUserinfoByProvider = async (token, provider) => {
  const locale = getLanguage();

  return fetch(`${API_URL}/${locale}/oauth/userinfo`, {
    method: "get",
    headers: {
      Accept: "application/vnd.api+json",
      "x-auth-provider": provider,
      Authorization: "Bearer " + token,
    },
  });
};

export const formatFormData = (params = {}, separator = "&") => {
  let formData = [];

  for (var property in params) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(params[property]);
    formData.push(encodedKey + "=" + encodedValue);
  }

  return formData.join(separator);
};
