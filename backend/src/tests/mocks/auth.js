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
  return true;
};

/**
 * MOCK - Handles login attempts, sets the cookie and returns the user.
 *
 * @param {string} email - email provided by the user
 * @param {string} password - password provided by the user
 * @param {object} res - HTTP response
 * @param {User} User - User model
 * @return {object} User
 */
const attemptLogin = async (email, password, res, User) => {
  const user = await User.findByEmail(email);
  return user;
};

/**
 * MOCK - Clears the cookie and returns true.
 * @returns {boolean} Always true
 */
const attemptLogout = async () => {
  return true;
};

module.exports = { attemptLogin, attemptLogout, ensureLoggedIn, ensureLoggedOut };
