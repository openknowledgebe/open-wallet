const { AuthenticationError } = require('apollo-server-express');
const { MUST_LOGOUT } = require('../../messages');

/**
 * MOCK - Ensures that a user is logged in.
 */
const ensureLoggedIn = () => {
  return true;
};

/**
 * MOCK - Ensures that a user is logged out.
 */
const ensureLoggedOut = () => {
  throw new AuthenticationError(MUST_LOGOUT);
};

module.exports = { ensureLoggedIn, ensureLoggedOut };
