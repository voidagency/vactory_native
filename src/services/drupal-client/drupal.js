import { deserialise } from "kitsu-core";
import { LoggerService } from "../logger.service";
import { JsonApiErrors } from "./jsonapi-errors"
import { query } from "./utils"
import { UserStore } from "@vactory/auth/UserStore"

// See https://jsonapi.org/format/#content-negotiation.
const DEFAULT_HEADERS = {
  "Content-Type": "application/vnd.api+json",
  Accept: "application/vnd.api+json",
};
const DEFAULT_WITH_AUTH = false;
const DEFAULT_DUPAL_API = "http://localhost:8080";

export class DrupalClient {
  _headers;
  _nextDrupalApi;
  withAuth;
  cache;
  logger;
  accessToken;
  debug = false;

  constructor(options = {}) {
    const {
      nextDrupalApi = DEFAULT_DUPAL_API,
      cache = null,
      debug = false,
      headers = DEFAULT_HEADERS,
      logger = LoggerService,
      withAuth = DEFAULT_WITH_AUTH,
      auth,
      fetcher,
      accessToken,
    } = options;

    this._nextDrupalApi = nextDrupalApi;
    this.debug = debug;
    this.fetcher = fetcher;
    this.headers = headers;
    this.logger = logger;
    this.withAuth = withAuth;
    this.cache = cache;
    this.auth = auth;
    this.accessToken = accessToken;
    this._debug("Debug mode is on.");
  }

  set auth(auth) {
    this._auth = auth;
  }

  /**
   * @param {any} value
   */
  set headers(value) {
    this._headers = value;
  }

  async fetch(input, init = {}) {
    init = {
      ...init,
      headers: {
        ...(typeof init.skipDefaultHeaders === "undefined" && {
          ...this._headers,
        }),
        ...init?.headers,
      },
    };

    if (init?.withAuth) {
      this._debug(`Using authenticated request.`);
      if (typeof init.withAuth === "function") {
        this._debug(`Using custom auth.`);
        init["headers"]["Authorization"] = init.withAuth();
      } else {
        // Otherwise use the built-in client_credentials grant.
        this._debug(`Using default auth (client_credentials).`);

        // Fetch an access token and add it to the request.
        // Access token can be fetched from cache or using a custom auth method.
        // const session = await getSession()
        // const session = {};
        const token = await this.getAccessToken();

        if (token) {
          init["headers"]["Authorization"] = `Bearer ${token.accessToken}`;
          init["headers"]["X-Auth-Provider"] = token.provider;
        }
      }
    }

    if (this.fetcher) {
      this._debug(`Using custom fetcher.`);

      return await this.fetcher(input, init);
    }

    if (init?.absoluteUrl) {
      return await fetch(input, init);
    }

    return await fetch(`${this._nextDrupalApi}/${input}`, init);
  }

  async upload(input, init, filename, binary) {
    const { locale, ...rest } = init;

    return this.fetch("/api/upload", {
      ...rest,
      absoluteUrl: true,
      skipDefaultHeaders: true,
      method: "POST",
      headers: {
        ...init?.headers,
        "x-language": locale,
        "x-path": input,
        Accept: "application/json",
        "Content-Disposition": 'file; filename="' + filename + '"',
      },
      body: binary,
    });
  }

  async sendLogMessageToDrupal(body) {
    return this.fetch("api/capture-log", {
      noProxy: true,
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async getAccessToken() {
    const user = UserStore.getUser()

    if (!user) {
      return null
    }

    return {
      accessToken: user.access_token,
      tokenType: user.token_type,
      provider: user.provider,
    }
  }

  async getTranslations(options = {}) {
    if (options?.withCache) {
      const cached = await this.cache.get(options.cacheKey);

      if (cached) {
        this._debug(
          `Returning cached translation items using key ${options.cacheKey}`
        );
        return JSON.parse(cached);
      }
    }

    const path = `_translations`;
    this._debug(`Fetching translations from ${this._nextDrupalApi}_translations.`);

    const response = await this.fetch(path, { noProxy: true });

    if (!response?.ok) {
      await this.handleJsonApiErrors(response);
    }

    const data = await response.json();

    if (options.withCache) {
      await this.cache.set(options.cacheKey, JSON.stringify(data));
    }

    return data;
  }

  async getMenu(name, locale, options = {}) {
    if (options?.withCache) {
      const cached = await this.cache.get(options.cacheKey);

      if (cached) {
        this._debug(
          `Returning cached menu items for ${name} using key ${options.cacheKey}`
        );
        return JSON.parse(cached);
      }
    }

    const path = `${locale}/_menus?menu_name=${name}`;
    this._debug(`Fetching menu items for ${name}.`);
    this._debug(`${this._nextDrupalApi}/${path}`);

    const response = await this.fetch(path, { ...options, noProxy: true });

    if (!response?.ok) {
      await this.handleJsonApiErrors(response);
    }

    const data = await response.json();

    if (options.withCache) {
      await this.cache.set(options.cacheKey, JSON.stringify(data));
    }

    return data;
  }

  async getRoute(slug, locale, options = {}) {
    slug = `/${slug}`.replace("//", "/");
    const path = `${locale}/api/router?path=${slug}`.replace(/\/\//g, '/')
    this._debug(`Fetching router item for page /${locale}${slug}.`);
    this._debug(`${this._nextDrupalApi}/${path}`);

    const response = await this.fetch(path, { ...options, noProxy: true });
    // console.log(response)

    if (!response?.ok) {
      // await this.handleJsonApiErrors(response);
    }

    return response;
  }

  async getNode(router, params, locale, slug, options = {}) {
    if (options?.withCache) {
      const cached = await this.cache.get(options.cacheKey);

      if (cached) {
        this._debug(
          `Returning cached node ${router.entity.id} / ${router.entity.bundle} for /${locale}/${slug} using key ${options.cacheKey}`
        );
        return JSON.parse(cached);
      }
    }

    const jsonParams = query(params);
    this._debug(
      `Fetching node ${router.entity.id} / ${router.entity.bundle} for /${locale}/${slug}.`
    );
    this._debug(router.jsonapi.individual + "?" + jsonParams);

    const response = await this.fetch(
      router.jsonapi.individual + "?" + jsonParams,
      {
        ...options,
        absoluteUrl: true,
      }
    );

    if (!response?.ok) {
      await this.handleJsonApiErrors(response);
    }

    const data = await response.json();
    const jsonApiData = this.deserialize(data)?.data;

    if (options.withCache) {
      await this.cache.set(options.cacheKey, JSON.stringify(jsonApiData));
    }

    return jsonApiData;
  }

  async getNodeCollection(type, options = {}) {
    if (!options.locale) {
      throw new Error(
        "[drupal-client] Calling getNodeCollection without option.locale"
      );
    }

    // if (options?.withCache) {
    // 	const cached = (await this.cache.get(options.cacheKey))

    // 	if (cached) {
    // 		this._debug(`Returning node collection ${type} using key ${options.cacheKey}`)
    // 		return JSON.parse(cached)
    // 	}
    // }

    const jsonParams = query(options?.params || []);
    this._debug(`Fetching collection ${type}.`);
    // this._debug(
    // 	decodeURIComponent(
    // 		`${process.env.NEXT_PUBLIC_BASE_URL}/${this._nextApiProxy}/${options.locale}/api/node/${type}?${jsonParams}`
    // 	)
    // )

    const response = await this.fetch(
      `${options.locale}/api/node/${type}?${jsonParams}`,
      { ...options }
    );

    if (!response?.ok) {
      await this.handleJsonApiErrors(response);
    }

    const data = await response.json();
    // const jsonApiDocument = this.deserialize(data)

    // if (options.withCache) {
    // 	await this.cache.set(options.cacheKey, JSON.stringify(jsonApiDocument))
    // }

    return data;
  }

  deserialize(body) {
    if (!body) return null;

    return deserialise(body);
  }

  _debug(message) {
    !!this.debug && this.logger.debug(message, 'drupal-client');
  }

  async getErrorsFromResponse(response) {
    const type = response.headers.get("content-type");
    let message = `URL: ${response.url}`;

    if (type === "application/json") {
      const error = await response.json();
      message += " " + error.message;
      return message;
    }

    // Construct error from response.
    // Check for type to ensure this is a JSON:API formatted error.
    // See https://jsonapi.org/format/#errors.
    if (type === "application/vnd.api+json") {
      const _error = await response.json();

      if (_error?.errors?.length) {
        message += " " + _error.errors.join(" ,");
        return message;
      }
    }

    message += " " + response.statusText;
    return message;
  }

  // Error handling.
  // If throwErrors is enable, we show errors in the Next.js overlay.
  // Otherwise we log the errors even if debugging is turned off.
  // In production, errors are always logged never thrown.
  throwError(error) {
    if (!this.throwJsonApiErrors) {
      return this.logger.error(error);
    }

    throw error;
  }

  async handleJsonApiErrors(response) {
    if (!response?.ok) {
      // console.log(response.url)
      // console.log(response.headers)
      // throw new Error(response)
      const errors = await this.getErrorsFromResponse(response);
      throw new JsonApiErrors(errors, response.status);
    }
  }
}
