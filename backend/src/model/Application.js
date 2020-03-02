const DAO = require('../integration/ApplicationDAO');

/**
 * Represents an application.
 */
class Application {
  /**
   * Create an application
   * @param {Object} form
   * @param {Object} user
   */
  constructor(form, user) {
    this.version = form.version || 1;
    this.status = form.status || 'unhandled';
    const { availabilities, competences } = form;
    this.availabilities = availabilities;
    this.competences = competences;
    this.person = {
      id: user.person_id,
      name: user.name,
      surname: user.surname,
      ssn: user.ssn,
      email: user.email,
    };

    this.store = async () => {
      await DAO.store(this);
    };
  }
}

/**
 * Checks if an application exists for a user.
 * @param {number} personId
 * @return {boolean} Application exists
 */
async function exists(personId) {
  return DAO.exists(personId);
}

/**
 * Finds an application for a user.
 * @param {number} personId
 * @return {Object} An application
 */
async function find(personId) {
  return DAO.find(personId);
}

/**
 * Gets all applications.
 * @return {Object[]} List of applications
 */
async function getAll() {
  return DAO.getAll();
}

async function updateStatus(data) {
  return DAO.update(data);
}

module.exports = {
  Application,
  exists,
  find,
  getAll,
  updateStatus,
};
