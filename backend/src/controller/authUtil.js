const bcrypt = require('bcryptjs');
const NodeCache = require('node-cache');

const myCache = new NodeCache({ stdTTL: 60 * 30, checkperiod: 60 * 10 });
const saltRounds = 10;

/**
 * Creates a hash from credentials.
 * @param {Object} credentials 
 * @return {Promise<string>} Hashed credentials
 */
async function encrypt(credentials) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(credentials, saltRounds, (error, hash) => {
      if (error) {
        reject(error);
      }
      resolve(hash);
    });
  });
}

/**
 * Stores a hash and creates a session for the user.
 * @param {string} hash 
 * @param {Object} user 
 */
function storeHash(hash, user) {
  myCache.set(hash, user);
}

/**
 * Gets the user details for the user with this hash.
 * @param {string} hash 
 * @return {Object} A user
 */
function getUser(hash) {
  const user = myCache.get(hash);
  return user;
}
/**
 * Checks if the user with a hash is a recruiter.
 * @param {string} hash
 * @return {boolean} a boolean
 */
function isRecruiter(hash) {
  return getUser(hash).role === 1;
}

/**
 * Checks if the user with this hash is currently authenticated.
 * @param {string} hash 
 * @return {boolean} is authenticated
 */
function isAuthenticated(hash) {
  if (!hash) return false;
  const user = myCache.get(hash);
  if (!user) {
    return false;
  }
  return true;
}

module.exports = {
  encrypt,
  storeHash,
  isRecruiter,
  getUser,
  isAuthenticated,
};
