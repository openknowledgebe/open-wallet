const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const { APP_SECRET } = process.env;

/**
 * Retrieve the cookie and return the bearer data.
 *
 * @param {object} req - HTTP request
 * @return User
 */
const loggedUser = async ({ token }) => {
  if (token) {
    // Verify the token
    const { userId } = jwt.verify(token, APP_SECRET);
    // Get the user
    return userId && User.findById(userId);
  }
  return null;
};

const attemptLogin = async (email, password, res) => {
  const message = 'Incorrect email or password. Please try again.';

  const user = await User.findByEmail(email);
  // compare provided password against stored password
  const isCorrect = user && (await new User(user).rightPassword(password));
  if (!isCorrect) {
    throw new AuthenticationError(message);
  }
  // generate JWT
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  // set cookie
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 1000 // 1d TODO to put inside .env or config
  });
  return user;
};

const attemptLogout = async res => {
  res.clearCookie('token');
  return { status: true };
};

module.exports = { loggedUser, attemptLogin, attemptLogout };
