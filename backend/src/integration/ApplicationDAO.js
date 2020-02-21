const { Transaction } = require('./dbh')

const PREPARED_STATEMENT_STORE_APPLICATION = 'INSERT INTO Application (version, person, status) VALUES ($1, $2, $3);'
const PREPARED_STATEMENT_STORE_AVAILABILITY = 'INSERT INTO Availability (person, from_date, to_date) VALUES ($1, $2, $3);'
const PREPARED_STATEMENT_GET_COMPETENCE_ID = 'SELECT competence_id FROM Competence WHERE name = $1;'
const PREPARED_STATEMENT_STORE_COMPETENCE_PROFILE = 'INSERT INTO Competence_profile (person, competence, years_of_experience) VALUES ($1, $2, $3);'
const PREPARED_STATEMENT_FIND_APPLICATION = 'SELECT * FROM Application WHERE person = $1;'
const PREPARED_STATEMENT_FIND_COMPETENCES = 'SELECT * FROM Competence_profile WHERE person = $1;'
const PREPARED_STATEMENT_FIND_AVAILABILITIES = 'SELECT * FROM Availability WHERE person = $1;'
const PREPARED_STATEMENT_GET_ALL_APPLICATIONS = 'SELECT * FROM Application;'

const transaction = new Transaction()

async function store (application) {
  try {
    await transaction.start()
    const { person, availabilities, competences, status, version } = application
    await transaction.query(PREPARED_STATEMENT_STORE_APPLICATION, [version, person, status])
    for (const availability of availabilities) {
      await transaction.query(PREPARED_STATEMENT_STORE_AVAILABILITY, [person, availability.from, availability.to])
    }
    for (const competence of competences) {
      const res = await transaction.query(PREPARED_STATEMENT_GET_COMPETENCE_ID, [competence.name])
      await transaction.query(PREPARED_STATEMENT_STORE_COMPETENCE_PROFILE, [person, res.rows[0].competence_id, competence.years_of_experience])
    }
    await transaction.end()
  } catch (error) {
    await transaction.rollback()
    throw { code: 500, message: `Database error: ${error.message}` }
  }
}

async function exists (personId) {
  try {
    await transaction.start()
    const res = await transaction.query(PREPARED_STATEMENT_FIND_APPLICATION, [personId])
    const exist = res.rows.length > 0
    await transaction.end()
    return exist
  } catch (error) {
    await transaction.rollback()
    throw { code: 500, message: `Database error: ${error.message}` }
  }
}

async function find (personId) {
  try {
    await transaction.start()
    const values = await Promise.all([
      transaction.query(PREPARED_STATEMENT_FIND_APPLICATION, [personId]),
      transaction.query(PREPARED_STATEMENT_FIND_COMPETENCES, [personId]),
      transaction.query(PREPARED_STATEMENT_FIND_AVAILABILITIES, [personId])
    ])
    const application = values[0].rows[0]
    const competences = values[1].rows
    const availabilities = values[2].rows
    const applicationDetails = {
      person: personId,
      version: application.version,
      status: application.status,
      availabilities,
      competences
    }
    await transaction.end()
    return applicationDetails
  } catch (error) {
    await transaction.rollback()
    throw { code: 500, message: `Database error: ${error.message}` }
  }
}

async function getAll () {
  try {
    await transaction.start()
    const applications = (await transaction.query(PREPARED_STATEMENT_GET_ALL_APPLICATIONS)).rows
    await transaction.end()
    return applications
  } catch (error) {
    await transaction.rollback()
    throw { code: 500, message: `Database error: ${error.message}` }
  }
}

module.exports = {
  store,
  exists,
  find,
  getAll
}
