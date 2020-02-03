const DAO = require('../integration/UserDAO')

class User {
  constructor (details) {
    this.name = details.name
    this.surname = details.surname
    this.ssn = details.ssn
    this.email = details.email
    this.username = details.username
    this.password = details.password
    this.role_id = details.role_id || null

    this.store = async () => {
      await DAO.store(this)
    }
  }
}

module.exports = User
