const User = require('../../models/user');
const { attemptLogin, attemptLogout } = require('../../auth');

module.exports = {
  register: async (_, { user }) => User(user).save(),
  logout: (_, args, { res }) => {
    return attemptLogout(res);
  },
  login: async (_, { email, password }, { res }) => {
    return attemptLogin(email, password, res);
  }
};
