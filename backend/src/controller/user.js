const { User } = require('../model/User');

/**
 * Creates a new user.
 * @param {Object} details 
 */
async function createNewUser(details) {
  const newUser = new User(details);
  await newUser.store();
}

module.exports = { createNewUser };
