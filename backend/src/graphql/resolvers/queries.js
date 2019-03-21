const User = require("../../models/user");

module.exports = {
  users: async () => {
    return (users = await User.find());
  },
  login: ({ email, password }) => {}
};
