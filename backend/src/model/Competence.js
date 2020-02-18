const DAO = require('../integration/CompetenceDAO')

class Competence {
  constructor (name) {
    this.name = name

    this.store = async () => {
      await DAO.store(this)
    }
  }
}

async function getAll () {
  return (await DAO.findAll()).map(competenceName => new Competence(competenceName))
}

module.exports = {
  Competence,
  getAll
}
