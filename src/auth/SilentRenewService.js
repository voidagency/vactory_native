import { Log } from "./Log.js";

export class SilentRenewService {
  constructor(userManager) {
    this._userManager = userManager;
  }

  start() {
    if (!this._callback) {
      this._callback = this._tokenExpiring.bind(this);
      this._userManager.events.addAccessTokenExpiring(this._callback);

      // this will trigger loading of the user so the expiring events can be initialized
      this._userManager.getUser();
    }
  }

  stop() {
    if (this._callback) {
      this._userManager.events.removeAccessTokenExpiring(this._callback);
      delete this._callback;
    }
  }

  _tokenExpiring() {
    this._userManager.signinSilent().then(
      (user) => {
        Log.debug(
          "SilentRenewService._tokenExpiring: Silent token renewal successful"
        );
      },
      (err) => {
        Log.error(
          "SilentRenewService._tokenExpiring: Error from signinSilent:" + err
        );
        this._userManager.events._raiseSilentRenewError(err);
      }
    );
  }
}
