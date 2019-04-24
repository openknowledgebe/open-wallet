module.exports = {
  register: async (_, { user }, { models: { User } }) => User(user).save(),
  logout: (_, args, { res, auth }) => {
    return auth.attemptLogout(res);
  },
  login: async (_, { email, password }, { res, models: { User }, auth }) => {
    return auth.attemptLogin(email, password, res, User);
  },
  updateProfile: async (_, args, { user, models: { User } }) => {
    const { email } = args.user;
    if (email) {
      if (user.email === email) {
        delete args.user.email;
      } else {
        const emailAlreadyUsed = User.findByEmail(email);
        if (emailAlreadyUsed) {
          throw new Error('Email already exists!');
        }
      }
    }
    return User.findOneAndUpdate({ _id: user.id }, args.user, { new: true });
  }
};
