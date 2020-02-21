const bcrypt = require('bcryptjs')
const NodeCache = require('node-cache')

const myCache = new NodeCache({ stdTTL: 60 * 30, checkperiod: 60 * 10 })
const saltRounds = 10

async function encrypt (credentials) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(credentials, saltRounds, function (error, hash) {
      if (error) {
        reject(error)
      }
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

function isRecruiter (hash) {
  return getUser(hash).role === 1
}

function isAuthenticated (hash) {
  if (!hash) return false
  const user = myCache.get(hash)
  if (!user) {
    return false
  }
  return true
}

module.exports = {
  encrypt,
  storeHash,
  isRecruiter,
  getUser,
  isAuthenticated
}
