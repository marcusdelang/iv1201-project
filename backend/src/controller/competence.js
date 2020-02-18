const { getAll: getAllCompetences } = require('../model/Competence')

async function getAll () {
  try {
    return await getAllCompetences()
  } catch (error) {
    throw { code: error.code, message: `Could not find competences: ${error.message}` }
  }
}

module.exports = { getAll }
