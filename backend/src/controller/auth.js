const bcrypt = require('bcrypt')
const { find: findUser } = require('../model/User')

const saltRounds = 10

async function auth(credentials) {
    const { username, password } = credentials;
    const foundUser = await findUser(username)
    if (!foundUser.verifyPassword(password)) {
        throw { code: 401, message: 'Invalid password' }
    }
    return new Promise((resolve, reject) => {
        bcrypt.hash(`${username}:${password}`, saltRounds, function (error, hash) {
            if (error) {
                reject(error)
            }
            resolve({ auth: hash, user: foundUser.serialize() })
        })
    })
}

module.exports = { auth }