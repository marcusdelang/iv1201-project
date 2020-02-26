const jwt = require('jsonwebtoken');
const { find: findUser } = require('../model/User');

// const { privateKey } = require('../config')
const privateKey = 'privateKeyExample';

/**
 * Creates a token from credentials.
 * @param {Object} credentials
 * @return {Promise<string>} A token
 */

function sign(credentials) {
  return new Promise((resolve, reject) => {
    credentials.timestamp = Date.now();
    jwt.sign(JSON.stringify(credentials), privateKey, { algorithm: 'HS256' }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}

/**
 * Verifies a token.
 * @param {string} token
 * @return {Promise<Object>} A user.
 */
async function isAuthenticated(token) {
  try {
    await getUser(token);
    return true;
  } catch (error) {
    return false;
  }
}

function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, (error, decoded) => {
      if (error) return reject(error);
      if (Date.now() - decoded.date > 1800000) {
        reject();
      }
      resolve(decoded);
    });
  });
}

/**
 * Gets the user details for the user with this hash.
 * @param {string} token
 * @return {Object} A user
 */
async function getUser(token) {
  const { username, password } = await verify(token);
  const user = await findUser(username);
  if (!user.verifyPassword(password)) {
    throw { code: 401, message: 'Invalid credentials' };
  }
  return user;
}
/**
 * Checks if the user with a hash is a recruiter.
 * @param {string} hash
 * @return {boolean} a boolean
 */
async function isRecruiter(token) {
  return (await getUser(token)).role === 1;
}

module.exports = {
  sign,
  verify,
  isRecruiter,
  getUser,
  isAuthenticated,
};
