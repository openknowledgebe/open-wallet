const { users } = require('../data');

class User {
  constructor(user) {
    Object.keys(user).forEach(prop => {
      this[prop] = user[prop];
    });
  }

  async rightPassword(password) {
    return this.password === password;
  }

  static async findById(id) {
    return users[id];
  }

  static async findByEmail(email) {
    let user = null;
    Object.keys(users).forEach(id => {
      if (users[id].email === email) {
        user = users[id];
        return false;
      }
      return true;
    });
    return user;
  }
}

module.exports = User;
