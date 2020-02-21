const {Transaction} = require('./dbh')

const PREPARED_STATEMENT_GET_APPLICANT_ROLE_ID = 'SELECT role_id FROM Role WHERE name = \'applicant\';'
const PREPARED_STATEMENT_STORE_USER = 'INSERT INTO Person (name, surname, ssn, email, username, password, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7);'
const PREPARED_STATEMENT_FIND_USER = 'SELECT * FROM Person WHERE username = $1;'

async function getApplicantRoleId () {
  let res
  try {
    const transaction = new Transaction()
    await transaction.start()
    res = await transaction.query(PREPARED_STATEMENT_GET_APPLICANT_ROLE_ID)
    transaction.end()
  } catch (error) {
    transaction.rollback()
    throw { code: 500, message: `Database error: ${error.message}` }
  }
  return res.rows[0].role_id
}

async function store (user) {
  const roleId = await getApplicantRoleId()
  const values = [user.name, user.surname, user.ssn, user.email, user.username, user.password, roleId]
  try {
    await db.query(PREPARED_STATEMENT_STORE_USER, values)
  } catch (error) {
    throw { code: 500, message: `Database error: ${error.message}` }
  }
}

async function find (username) {
  const values = [username]
  let res
  try {
    res = await db.query(PREPARED_STATEMENT_FIND_USER, values)
  } catch (error) {
    throw { code: 500, message: `Database error: ${error.message}` }
  }
  if (res.rows.length === 0) {
    throw { code: 404, message: 'No such user' }
  }
  return res.rows[0]
}

module.exports = {
  store,
  find
}
