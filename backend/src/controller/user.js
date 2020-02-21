const { User } = require('../model/User');

async function newUser(details) {
  const newUser = new User(details);
  await newUser.store();
}

module.exports = { newUser };
