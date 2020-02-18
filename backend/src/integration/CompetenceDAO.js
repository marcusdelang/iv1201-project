const db = require('./dbh')
const PREPARED_STATEMENT_FIND_ALL_COMPETENCES = 'SELECT name FROM Competence;'

async function findAll () {
  const competences = []
  const res = await db.query(PREPARED_STATEMENT_FIND_ALL_COMPETENCES)
  for (const row of res.rows) {
    competences.push(row.name)
  }
  return competences
}

module.exports = {
  findAll
}
