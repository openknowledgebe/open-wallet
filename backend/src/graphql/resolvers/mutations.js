const User = require("../../models/user");

module.exports = {
  register: (_, args) => {
    new User(args).save();
  }
};
