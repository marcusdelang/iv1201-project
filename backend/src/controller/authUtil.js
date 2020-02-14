const bcrypt = require('bcryptjs')
const NodeCache = require('node-cache')
const { find: findUser } = require('../model/User')

const myCache = new NodeCache({ stdTTL: 60 * 30, checkperiod: 60 * 10 })
const saltRounds = 10

async function encrypt (credentials) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(credentials, saltRounds, function (error, hash) {
      if (error) {
        reject(error)
      }
      console.log(hash)
      resolve(hash)
    })
  })
}

function storeHash (hash, user) {
  myCache.set(hash, user)
}

function getUser (hash) {
  const user = myCache.get(hash)
  return user
}

function isAuthenticated (hash) {
  const user = myCache.get(hash)
  if (!user) {
    return false
  }
  return true
}

module.exports = {
  encrypt,
  storeHash,
  getUser,
  isAuthenticated
}
