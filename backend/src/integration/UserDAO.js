
const db = require('./dbh')

const PREPARED_STATEMENT_GET_APPLICANT_ROLE_ID = 'SELECT role_id FROM Role WHERE name = \'applicant\';'
const PREPARED_STATEMENT_STORE_USER = 'INSERT INTO Person (name, surname, ssn, email, username, password, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7);'

async function getApplicantRoleId () {
  let res
  try {
    res = await db.query(PREPARED_STATEMENT_GET_APPLICANT_ROLE_ID)
  } catch (error) {
    throw error
  }
  return res.rows[0].role_id
}

async function store (user) {
  const roleId = await getApplicantRoleId()
  const values = [user.name, user.surname, user.ssn, user.email, user.username, user.password, roleId]
  await db.query(PREPARED_STATEMENT_STORE_USER, values)
}

module.exports = {
  store
}
