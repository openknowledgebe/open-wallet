const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const { APP_SECRET = 'mysecret' } = process.env;

const { MUST_LOGIN, MUST_LOGOUT, WRONG_EMAIL_PASSWORD } = require('./messages');

/**
 * Retrieves the cookie and returns the bearer data.
 *
 * @param {object} req - HTTP request
 * @param {object} models - Models provider, must have a User model
 * @returns {Promise} Promise object represents the user
 */
const loggedUser = async ({ token }, { User }) => {
  if (token) {
    // Verify the token
    try {
      const { userId } = jwt.verify(token, APP_SECRET);
      // Get the user
      return userId && User.findById(userId);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Returns whether a user is logged in or not.
 * @param { object } user - logged in user
 * @returns {boolean} True of false
 */
const loggedIn = ({ user }) => !!user;

/**
 * Ensures that a user is logged in.
 * @param {object} ctx - Application context
 */
const ensureLoggedIn = ctx => {
  if (!loggedIn(ctx)) {
    throw new AuthenticationError(MUST_LOGIN);
  }
};

/**
 * Ensures that a user is logged out.
 * @param {object} ctx - Application context
 */
const ensureLoggedOut = ctx => {
  if (loggedIn(ctx)) {
    throw new AuthenticationError(MUST_LOGOUT);
  }
};

/**
 * Handles login attempts, sets the cookie and returns the user.
 *
 * @param {string} email - email provided by the user
 * @param {string} password - password provided by the user
 * @param {object} res - HTTP response
 * @param {User} User - User model
 * @return {object} User
 * @throws {AuthenticationError}
 */
const attemptLogin = async (email, password, res, User) => {
  const user = await User.findByEmail(email);
  // compare provided password against stored password
  const isCorrect = user && (await new User(user).rightPassword(password));
  if (!isCorrect) {
    throw new AuthenticationError(WRONG_EMAIL_PASSWORD);
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

/**
 * Clears the cookie and returns true.
 * @param {*} res - HTTP response
 * @returns {boolean} Always true
 */
const attemptLogout = async res => {
  res.clearCookie('token');
  return true;
};

module.exports = { loggedUser, attemptLogin, attemptLogout, ensureLoggedIn, ensureLoggedOut };
