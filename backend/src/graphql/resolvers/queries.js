const User = require("../../models/user");

module.exports = {
  getUsers: async () => {
    return (users = await User.find());
  }
};
