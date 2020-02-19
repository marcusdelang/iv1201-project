const db = require('./dbh')

const PREPARED_STATEMENT_STORE_APPLICATION = 'INSERT INTO Application (version, person, status) VALUES ($1, $2, $3);'
const PREPARED_STATEMENT_STORE_AVAILABILITY = 'INSERT INTO Availability (person_id, from_date, to_date) VALUES ($1, $2, $3);'
const PREPARED_STATEMENT_GET_COMPETENCE_ID = 'SELECT competence_id FROM Competence WHERE name = $1;'
const PREPARED_STATEMENT_STORE_COMPETENCE_PROFILE =
  'INSERT INTO Competence_profile (person_id, competence_id, years_of_experience)' +
  'VALUES ($1, $2, $3);'

const PREPARED_STATEMENT_FIND_APPLICATION = 'SELECT * FROM Application WHERE person = $1;'
const PREPARED_STATEMENT_FIND_COMPETENCES = 'SELECT * FROM Competence_profile WHERE person = $1;'
const PREPARED_STATEMENT_FIND_AVAILABILITIES = 'SELECT * FROM Availability WHERE person = $1;'

async function store(application) {
  const { person, availabilities, competences, status, version } = application
  try {
    await db.query(PREPARED_STATEMENT_STORE_APPLICATION, [version, person, status])
    for (const availability of availabilities) {
      await db.query(PREPARED_STATEMENT_STORE_AVAILABILITY, [person, availability.from, availability.to])
    }
    for (const competence of competences) {
      const res = await db.query(PREPARED_STATEMENT_GET_COMPETENCE_ID, [competence.name]);
      if (res.rows.length === 0) {
        throw {code: 500, message: 'No such competence'}
      }
      await db.query(PREPARED_STATEMENT_STORE_COMPETENCE_PROFILE, [person, res.rows[0].competence_id, competence.years_of_experience])
    }
  } catch (error) {
    throw { code: 500, message: `Database error: ${error.message}` }
  }
}

async function exists(personId) {
  try {
    const res = await db.query(PREPARED_STATEMENT_FIND_APPLICATION, [personId])
    return res.rows.length > 0
  } catch (error) {
    throw { code: 500, message: `Database error: ${error.message}` }
  }
}

async function find(personId) {
  let values
  try {
    values = await Promise.all([
      db.query(PREPARED_STATEMENT_FIND_APPLICATION, [personId]),
      db.query(PREPARED_STATEMENT_FIND_COMPETENCES, [personId]),
      db.query(PREPARED_STATEMENT_FIND_AVAILABILITIES, [personId])
    ])
  } catch (error) {
    throw { code: 500, message: `Database error: ${error.message}` }
  }
  const application = values[0]
  const competences = values[1]
  const availabilites = values[2]
  const applicationDetails = {
    person: personId,
    version: application.version,
    status: application.status,
    availabilites: availabilites,
    competences: competences
  }
  return new Application(applicationDetails)
}

module.exports = {
  store,
  exists,
  find
}
