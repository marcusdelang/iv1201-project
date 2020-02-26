const DAO = require('../integration/CompetenceDAO');

/**
 * Represents a competence.
 */
class Competence {
  /**
   * Create a competence.
   * @param {string} name
   */
  constructor(name) {
    this.name = name;

    this.store = async () => {
      await DAO.store(this);
    };
    this.serialize = () => this.name;
  }
}

/**
 * Gets all competences.
 * @return {Object[]} List of competences.
 */
async function getAll() {
  return (await DAO.findAll()).map((competenceName) => new Competence(competenceName));
}

module.exports = {
  Competence,
  getAll,
};
