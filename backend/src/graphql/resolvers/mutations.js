const User = require("../../models/user");

module.exports = {
  register: (_, { user }) => {
    return new User(user).save();
  }
};
