class Response {
  constructor() {
    this.cookies = {};
  }

  cookie(name, payload, options) {
    this.cookies[name] = { payload, options };
  }

  clearCookie(name) {
    delete this.cookies[name];
  }
}

module.exports = Response;
