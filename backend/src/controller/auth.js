const { AuthError } = require('./../error');

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
  try {
    const { username, password } = credentials;
    let foundUser;
    foundUser = await findUser(username);
    if (!foundUser.verifyPassword(password)) {
      throw { message: 'invalid password' };
    }
    const token = await sign(credentials);
    logger.log(`Authenticated user ${foundUser.username}.`);
    return { auth: token, user: foundUser.serialize() };
  } catch (error) {
    throw new AuthError(error);
  }
}

module.exports = { auth };
