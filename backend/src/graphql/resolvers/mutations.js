const User = require("../../models/user");

module.exports = {
  register: (_, { user }) => {
    new User(user).save();
  }
};
