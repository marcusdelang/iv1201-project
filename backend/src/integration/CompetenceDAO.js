const { Transaction } = require('./dbh')
const PREPARED_STATEMENT_FIND_ALL_COMPETENCES = 'SELECT name FROM Competence;'

const transaction = new Transaction()

async function findAll () {
  try {
    await transaction.start()
    const competences = []
    const res = await transaction.query(PREPARED_STATEMENT_FIND_ALL_COMPETENCES)
    for (const row of res.rows) {
      competences.push(row.name)
    }
    await transaction.end()
    return competences
  } catch (error) {
    await transaction.rollback()
    throw { code: 500, message: `Database error: ${error.message}` }
  }
}

module.exports = {
  findAll
}
