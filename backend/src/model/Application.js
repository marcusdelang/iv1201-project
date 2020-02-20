const DAO = require('../integration/ApplicationDAO')

class Application {
  constructor (form, user) {
    form.version ? this.version = form.version : this.version = 1
    form.status ? this.status = form.status : this.status = 'unhandled'
    const { availabilities, competences } = form
    this.person = user.person_id
    this.availabilities = availabilities
    this.competences = competences

    this.store = async () => {
      await DAO.store(this)
    }
  }
}

async function exists (personId) {
  return DAO.exists(personId)
}

async function find (personId) {
  return DAO.find(personId)
}

async function getAll() {
  return DAO.getAll();
}

module.exports = {
  Application,
  exists,
  find,
  getAll
}
