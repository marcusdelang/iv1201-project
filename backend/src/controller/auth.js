/**
 * Credentials used for authentication.
 * @typedef {Object} credentials
 * @property {string} username - The Username
 * @property {string} password - The password
 */

const authUtil = require('./authUtil');
const { find: findUser } = require('../model/User');

/**
 * Creates a authenticated session for the user.
 * @param {credentials} credentials 
 * @return {Object} A hash and the user
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
  const hash = await authUtil.encrypt(`${username}:${password}`);
  authUtil.storeHash(hash, foundUser);
  return { auth: hash, user: foundUser.serialize() };
}

module.exports = { auth };
