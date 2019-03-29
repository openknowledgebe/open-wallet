const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
  users: async () => User.find(),
  login: async (_, { email, password }, { res }) => {
    const user = await User.findByEmail(email);
    // compare provided password against stored password
    const isCorrect = user && (await new User(user).rightPassword(password));
    if (!isCorrect) {
      throw new Error('Email or password incorrect.');
    }
    // generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000 // 1d
    });
    // return the user
    return user;
  },
  me: (_, args, { user }) => user,
  logout: (_, args, { res }) => {
    res.clearCookie('token');
    return { message: 'Successfully logged out' };
  }
};
