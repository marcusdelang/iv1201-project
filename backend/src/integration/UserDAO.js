
const db = require('./dbh')

const PREPARED_STATEMENT_GET_APPLICANT_ROLE_ID = 'SELECT role_id FROM Role WHERE name = \'applicant\';'
const PREPARED_STATEMENT_STORE_USER = 'INSERT INTO Person (name, surname, ssn, email, username, password, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7);'
const PREPARED_STATEMENT_FIND_USER = 'SELECT * FROM Person WHERE username = $1;'

async function getApplicantRoleId () {
  const res = await db.query(PREPARED_STATEMENT_GET_APPLICANT_ROLE_ID)
  return res.rows[0].role_id
}

async function store (user) {
  const roleId = await getApplicantRoleId()
  const values = [user.name, user.surname, user.ssn, user.email, user.username, user.password, roleId]
  await db.query(PREPARED_STATEMENT_STORE_USER, values)
}

async function find (username) {
  const values = [username]
  const res = await db.query(PREPARED_STATEMENT_FIND_USER, values)
  if (res.rows.length === 0) {
    throw new Error('No such user')
  }
  return res.rows[0]
}

module.exports = {
  store,
  find
}
