const { User } = require('../model/User');

async function createNewUser(details) {
  const newUser = new User(details);
  await newUser.store();
}

module.exports = { createNewUser };
