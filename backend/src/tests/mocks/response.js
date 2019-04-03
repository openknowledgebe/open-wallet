class Response {
  constructor() {
    this.cookies = {};
  }

  cookie(name, payload) {
    this.cookies[name] = payload;
  }

  clearCookie(name) {
    delete this.cookies[name];
  }
}

module.exports = Response;
