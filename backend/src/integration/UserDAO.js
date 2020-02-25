const { Transaction } = require('./dbh');

const PREPARED_STATEMENT_GET_APPLICANT_ROLE = 'SELECT role_id FROM Role WHERE name = \'applicant\';';
const PREPARED_STATEMENT_STORE_USER = 'INSERT INTO Person (name, surname, ssn, email, username, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7);';
const PREPARED_STATEMENT_FIND_USER = 'SELECT * FROM Person WHERE username = $1;';

const transaction = new Transaction();

async function getApplicantRoleId(activeTransaction) {
  const res = await activeTransaction.query(PREPARED_STATEMENT_GET_APPLICANT_ROLE);
  return res.rows[0].role_id;
}

/**
 * Stores a user in the database.
 * @param {Object} user
 */
async function store(user) {
  try {
    await transaction.start();
    const roleId = await getApplicantRoleId(transaction);
    const values = [
      user.name,
      user.surname,
      user.ssn,
      user.email,
      user.username,
      user.password,
      roleId];

    await transaction.query(PREPARED_STATEMENT_STORE_USER, values);
    await transaction.end();
  } catch (error) {
    await transaction.rollback();
    throw { code: 500, message: `Database error: ${error.message}` };
  }
}

/**
 * Find a user in the database.
 * @param {string} username
 * @return {Object} A user
 */
async function find(username) {
  try {
    await transaction.start();
    const res = await transaction.query(PREPARED_STATEMENT_FIND_USER, [username]);
    if (res.rows.length === 0) {
      throw { code: 404, message: 'No such user' };
    }
    await transaction.end();
    return res.rows[0];
  } catch (error) {
    await transaction.rollback();
    throw { code: 500, message: `Database error: ${error.message}` };
  }
}

module.exports = {
  store,
  find,
};
