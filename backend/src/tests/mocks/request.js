class Request {
  constructor() {
    this.cookies = {};
  }

  setCookie(name, payload) {
    this.cookies[name] = payload;
  }
}

module.exports = Request;
