const User = require('../../models/user');
const { attemptLogin, attemptLogout } = require('../../auth');

module.exports = {
  register: async (_, { user }) => User(user).save(),
  logout: (_, args, { res }) => {
    return attemptLogout(res);
  },
  login: async (_, { email, password }, { res }) => {
    return attemptLogin(email, password, res);
  },
  updateProfile: async (_, args, { user }) => {
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
