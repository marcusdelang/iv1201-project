const DAO = require('../integration/UserDAO')

class User {
  constructor(details) {
    this.name = details.name || null
    this.surname = details.surname || null
    this.ssn = details.ssn || null
    this.email = details.email || null
    this.username = details.username || null
    this.password = details.password || null
    this.role_id = details.role_id || null

    this.serialize = () => {
      return JSON.stringify({
        user: {
          name: this.name,
          surname: this.surname,
          ssn: this.ssn,
          email: this.email,
          username: this.username,
          role: this.role_id
        }
      })
    }

    this.store = async () => {
      await DAO.store(this)
    }
    this.verifyPassword = async (password) => {
      return password === this.password
    }
  }
}

async function find(username) {
  const details = await DAO.find(username)
  const user = new User(details)
  return user
}

const user = {
  User,
  find
}

module.exports = user
