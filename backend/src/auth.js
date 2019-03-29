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
    if (userId) {
      return User.findById(userId);
    }
  }
};

module.exports = { loggedUser };
