const User = require('../../models/user');

module.exports = {
  users: async () => User.find(),
  me: (_, args, { user }) => user
};
