module.exports = {
  users: async (root, args, { models: { User } }) => User.find(),
  login: async (_, { email, password }, { res, models: { User }, auth }) => {
    return auth.attemptLogin(email, password, res, User);
  },
  me: (_, args, { user }) => user,
  logout: (_, args, { res, auth }) => {
    return auth.attemptLogout(res);
  }
};
