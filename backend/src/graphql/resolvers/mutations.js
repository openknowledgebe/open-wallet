const bcrypt = require('bcrypt');
const User = require('../../models/user');

module.exports = {
  register: async (_, { user }) => {
    // TODO Valid email format
    // TODO Password is strong enough
    // lowercase the email
    const email = user.email.toLowerCase();
    // Make sure any user has the email
    const dupUser = await User.findOne({ email });
    if (dupUser) {
      throw new Error('An account with that email address already exists.');
    }
    // Hash Password
    const password = await bcrypt.hash(user.password, 10);
    // Register && Return the user
    return User({
      ...user,
      email,
      password
    }).save();
  }
};
