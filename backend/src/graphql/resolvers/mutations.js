module.exports = {
  register: async (_, { user }, { models: { User } }) => User(user).save(),
  logout: (_, args, { res, auth }) => {
    return auth.attemptLogout(res);
  },
  login: async (_, { email, password }, { res, models: { User }, auth }) => {
    return auth.attemptLogin(email, password, res, User);
  }
};
