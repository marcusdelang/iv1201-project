/**
 * Credentials used for authentication.
 * @typedef {Object} credentials
 * @property {string} username - The Username
 * @property {string} password - The password
 */

const logger = require('../util/logger');
const { find: findUser } = require('../model/User');
const { sign } = require('../util/authUtil');

/**
 * Creates a authenticated session for the user.
 * @param {credentials} credentials
 * @return {Object} A token and the user
 */
async function auth(credentials) {
  const { username, password } = credentials;
  let foundUser;
  try {
    foundUser = await findUser(username);
  } catch (error) {
    throw { code: error.code, message: `Could not find user: ${error.message}` };
  }
  if (!foundUser.verifyPassword(password)) {
    throw { code: 401, message: 'Invalid password' };
  }
  const token = await sign(credentials);
  logger.log(`Authenticated user ${foundUser.username}.`);
  return { auth: token, user: foundUser.serialize() };
}

module.exports = { auth };
