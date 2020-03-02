const { User } = require('../model/User');
const logger = require('./../util/logger');

/**
 * Creates a new user.
 * @param {Object} details
 */
async function createNewUser(details) {
  const newUser = new User(details);
  await newUser.store();
  logger.log(`User ${newUser.username} was created.`);
}

module.exports = { createNewUser };
