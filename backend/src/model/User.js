const DAO = require('../integration/UserDAO');

/**
 * Represents a user.
 */
class User {
  /**
   * Create a user.
   * @param {Object} details
   */
  constructor(details) {
    if (details.person_id) {
      this.person_id = details.person_id;
    }
    this.name = details.name || null;
    this.surname = details.surname || null;
    this.ssn = details.ssn || null;
    this.email = details.email || null;
    this.username = details.username || null;
    this.password = details.password || null;
    this.role = details.role || null;

    this.serialize = () => JSON.stringify({
      name: this.name,
      surname: this.surname,
      ssn: this.ssn,
      email: this.email,
      username: this.username,
      role: this.role,
    });

    this.store = async () => {
      await DAO.store(this);
    };
    this.verifyPassword = async (password) => password === this.password;
  }
}

/**
 * Find a user.
 * @param {string} username
 * @return {Object} A user.
 */
async function find(username) {
  const details = await DAO.find(username);
  const user = new User(details);
  return user;
}

const user = {
  User,
  find,
};

module.exports = user;
