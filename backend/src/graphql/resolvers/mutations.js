const User = require('../../models/user');

module.exports = {
  register: async (_, { user }) => User(user).save()
};
