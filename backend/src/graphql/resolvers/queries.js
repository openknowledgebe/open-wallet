const User = require('../../models/user');
const { attemptLogin, attemptLogout } = require('../../auth');

module.exports = {
  users: async () => User.find(),
  login: async (_, { email, password }, { res }) => {
    return attemptLogin(email, password, res);
  },
  me: (_, args, { user }) => user,
  logout: (_, args, { res }) => {
    return attemptLogout(res);
  }
};
