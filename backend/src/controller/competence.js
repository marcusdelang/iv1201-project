const { getAll: getAllCompetences } = require('../model/Competence');
const logger = require('./../util/logger');

/**
 * Gets all competences
 * @return {Object[]} List of competences
 */
async function getAll() {
  try {
    const competenceObjects = await getAllCompetences();
    logger.log('Got a request for all competences.');

    return competenceObjects.map((competence) => competence.serialize(competence));
  } catch (error) {
    throw { code: error.code, message: `Could not find competences: ${error.message}` };
  }
}

module.exports = { getAll };
