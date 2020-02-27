const { Transaction } = require('./dbh');

const PREPARED_STATEMENT_STORE_APPLICATION = 'INSERT INTO Application (version, person, status) VALUES ($1, $2, $3);';
const PREPARED_STATEMENT_STORE_AVAILABILITY = 'INSERT INTO Availability (person, from_date, to_date) VALUES ($1, $2, $3);';
const PREPARED_STATEMENT_GET_COMPETENCE_ID = 'SELECT competence_id FROM Competence WHERE name = $1;';
const PREPARED_STATEMENT_STORE_COMPETENCE_PROFILE = 'INSERT INTO Competence_profile (person, competence, years_of_experience) VALUES ($1, $2, $3);';
const PREPARED_STATEMENT_FIND_PERSON = 'SELECT * FROM Person WHERE person_id = $1;';
const PREPARED_STATEMENT_FIND_APPLICATION = 'SELECT * FROM Application WHERE person = $1;';
const PREPARED_STATEMENT_FIND_COMPETENCES = 'SELECT * FROM Competence_profile WHERE person = $1;';
const PREPARED_STATEMENT_FIND_AVAILABILITIES = 'SELECT * FROM Availability WHERE person = $1;';
const PREPARED_STATEMENT_GET_ALL_APPLICATIONS = 'SELECT * FROM Application;';

const transaction = new Transaction();

/**
 * Store an application in the database.
 * @param {Object} application
 */
async function store(application) {
  try {
    await transaction.start();
    const {
      person, availabilities, competences, status, version,
    } = application;
    await transaction.query(PREPARED_STATEMENT_STORE_APPLICATION,
      [version, person.id, status]);

    const queries = [];
    availabilities.forEach((availability) => {
      queries.push(transaction.query(PREPARED_STATEMENT_STORE_AVAILABILITY,
        [person.id, availability.from, availability.to]));
    });
    await Promise.all(queries);
    for (const competence of competences) {
      const res = await transaction.query(PREPARED_STATEMENT_GET_COMPETENCE_ID, [competence.name]);
      await transaction.query(PREPARED_STATEMENT_STORE_COMPETENCE_PROFILE,
        [person.id, res.rows[0].competence_id, competence.years_of_experience]);
    }
    await transaction.end();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Chekcs of an application exists in the database for a person.
 * @param {number} personId
 * @return {boolean} person exists
 */
async function exists(personId) {
  try {
    await transaction.start();
    const res = await transaction.query(PREPARED_STATEMENT_FIND_APPLICATION, [personId]);
    const exist = res.rows.length > 0;
    await transaction.end();
    return exist;
  } catch (error) {
    await transaction.rollback();
    throw { code: 500, message: `Database error: ${error.message}` };
  }
}

/**
 * Finds an application in the database.
 * @param {number} personId
 * @return {Object} An application
 */
async function find(personId) {
  try {
    await transaction.start();
    const applications = buildApplication(personId);
    await transaction.end();
    return applications;
  } catch (error) {
    await transaction.rollback();
    throw { code: 500, message: `Database error: ${error.message}` };
  }
}

async function buildApplication(personId){
  const values = await Promise.all([
    transaction.query(PREPARED_STATEMENT_FIND_APPLICATION, [personId]),
    transaction.query(PREPARED_STATEMENT_FIND_COMPETENCES, [personId]),
    transaction.query(PREPARED_STATEMENT_FIND_AVAILABILITIES, [personId]),
    transaction.query(PREPARED_STATEMENT_FIND_PERSON, [personId])
  ]);
  const application = values[0].rows[0];
  const competences = values[1].rows;
  const availabilities = values[2].rows;
  const person = values[3].rows[0];
  return {
    person: {
      id: person.person_id,
      name: person.name,
      surname: person.surname,
      ssn: person.ssn,
      email: person.email
    },
    version: application.version,
    status: application.status,
    availabilities,
    competences,
  };
}

/**
 * Gets all applications.
 * @return {Object[]} List of applications
 */
async function getAll() {
  try {
    await transaction.start();
    const applicationMetas = (await transaction.query(PREPARED_STATEMENT_GET_ALL_APPLICATIONS)).rows;
    const applications = [];
    for(meta of applicationMetas) {
      applications.push(await buildApplication(meta.person))
    }
    await transaction.end();
    return applications;
  } catch (error) {
    await transaction.rollback();
    throw { code: 500, message: `Database error: ${error.message}` };
  }
}

module.exports = {
  store,
  exists,
  find,
  getAll,
};
