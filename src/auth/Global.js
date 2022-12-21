const timer = {
  setInterval: function (cb, duration) {
    return setInterval(cb, duration);
  },
  clearInterval: function (handle) {
    return clearInterval(handle);
  },
};

let testing = false;

export class Global {
  static _testing() {
    testing = true;
  }

  static get timer() {
    if (!testing) {
      return timer;
    }
  }
}
