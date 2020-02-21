const { getAll: getAllCompetences } = require('../model/Competence')

async function getAll () {
  try {
    const competenceObjects = await getAllCompetences()
    return competenceObjects.map(competence => competence.serialize(competence))
  } catch (error) {
    throw { code: error.code, message: `Could not find competences: ${error.message}` }
  }
}

module.exports = { getAll }
