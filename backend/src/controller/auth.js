const bcrypt = require('bcryptjs')
const { find: findUser } = require('../model/User')

const saltRounds = 10

async function auth (credentials) {
  const { username, password } = credentials
  let foundUser
  try {
    foundUser = await findUser(username)
  } catch (error) {
    throw { code: error.code, messsage: `Could not find user: ${error.message}` }
  }
  if (!foundUser.verifyPassword(password)) {
    throw { code: 401, message: 'Invalid password' }
  }
  return new Promise((resolve, reject) => {
    bcrypt.hash(`${username}:${password}`, saltRounds, function (error, hash) {
      if (error) {
        reject(error)
      }
      console.log(hash)
      resolve({ auth: hash, user: foundUser.serialize() })
    })
  })
}

module.exports = { auth }
