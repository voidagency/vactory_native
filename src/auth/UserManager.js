import { Log } from "./Log.js";
import { User } from "./User.js";
import { UserManagerEvents } from "./UserManagerEvents.js";
import { SilentRenewService } from "./SilentRenewService.js";
import { UserStore } from "./UserStore";

export class UserManager {
  providers = [];

  constructor(settings = {}, SilentRenewServiceCtor = SilentRenewService) {
    this._settings = settings;

    if (!this._settings?.userStore) {
      this._settings.userStore = UserStore;
    }

    if (
      this._settings?.providers &&
      typeof this._settings?.providers === "object"
    ) {
      this.providers = this.setupProviders(this._settings.providers);
    }

    this._events = new UserManagerEvents(settings);
    this._silentRenewService = new SilentRenewServiceCtor(this);

    if (this.settings.automaticSilentRenew) {
      Log.debug(
        "UserManager.ctor: automaticSilentRenew is configured, setting up silent renew"
      );
      this.startSilentRenew();
    }
  }

  get settings() {
    return this._settings;
  }

  get events() {
    return this._events;
  }

  get _userStore() {
    return this.settings.userStore;
  }

  setupProviders(providers) {
    return providers.map((providerCallback) => {
      const provider = providerCallback();

      return {
        ...provider,
      };
    });
  }

  refreshProviders(providers) {
    this.providers = this.setupProviders(providers);
  }

  getProviders() {
    return this.providers;
  }

  getProvider(providerId) {
    return this.providers.find(({ id }) => id === providerId);
  }

  async signIn(providerId, options) {
    const provider = this.getProvider(providerId);
    let user = null,
      hasError = false,
      error = null;

    try {
      user = await provider.authorize(options);
    } catch (e) {
      hasError = true;
      error = e;
    }

    if (user) {
      this.storeUser(new User(user));
      this.getUser();
    }

    return {
      user,
      hasError,
      error,
    };
  }

  getUser() {
    const user = this._loadUser();

    if (user) {
      Log.info("UserManager.getUser: user loaded");
      this._events.load(user, false);
      return user;
    }

    Log.info("UserManager.getUser: user not found in storage");
    return null;
  }

  removeUser() {
    this.storeUser(null);
    Log.info("UserManager.removeUser: user removed from storage");
    this._events.unload();
  }

  _loadUser() {
    const storageUser = this._userStore.getUser();
    if (storageUser) {
      Log.debug("UserManager._loadUser: user loaded from storage");
      return new User(storageUser);
    }

    Log.debug("UserManager._loadUser: no user in storage");
    return null;
  }

  storeUser(user) {
    if (user) {
      Log.debug("UserManager.storeUser: storing user");
      return this._userStore.storeUser(user);
    }

    Log.debug("storeUser.storeUser: removing user");
    return this._userStore.removeUser();
  }

  startSilentRenew() {
    this._silentRenewService.start();
  }

  stopSilentRenew() {
    this._silentRenewService.stop();
  }

  async signinSilent(args = {}) {
    args = Object.assign({}, args);

    const user = this._loadUser();

    if (!user) {
      return Promise.reject("Failed to refresh token - no user in storage.");
    }

    if (!user?.refresh_token) {
      return Promise.reject(
        "Failed to refresh token - user has no refresh_token."
      );
    }

    const providerId = user.provider;
    const provider = this.getProvider(providerId);
    if (!provider?.refreshToken) {
      return Promise.reject(
        "Failed to refresh token - user provider has refreshToken method defined."
      );
    }

    let refreshUser = null;

    try {
      refreshUser = await provider.refreshToken(user);
    } catch (e) {
      Log.error(e);
    }

    if (refreshUser) {
      this.storeUser(new User(refreshUser));
      this.getUser();
      return Promise.resolve();
    }

    return Promise.reject("Failed to refresh token.");
  }
}
