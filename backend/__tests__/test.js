const axios = require('axios');
const path = require('path');
const config = require('../src/config');

const { port } = config;

const { Transaction, endConnection } = require('../../backend/src/integration/dbh');

const transaction = new Transaction();
let testAppId;
let testCompId;

async function clearDB(transaction) {
  return Promise.all([
    transaction.query('DELETE FROM Competence_profile *'),
    transaction.query('DELETE FROM Competence *'),
    transaction.query('DELETE FROM Application *'),
    transaction.query('DELETE FROM Availability *'),
    transaction.query('DELETE FROM Person *'),
  ]);
}

async function buildTestDB(transaction) {
  return Promise.all([
    transaction.query('INSERT INTO Competence (name) VALUES (\'testcomp\')'),
    transaction.query('INSERT INTO Person (name, surname, ssn, email, username, password, role) '
      + 'VALUES (\'testapp\', \'testapp\', \'testapp\', \'testapp@mail.com\', \'testapp\', \'testapp\', 2);'),
    transaction.query('INSERT INTO Person (name, surname, ssn, email, username, password, role) '
      + 'VALUES (\'testrec\', \'testrec\', \'testrec\', \'testrec@mail.com\', \'testrec\', \'testrec\', 1);'),
  ]);
}

describe('Endpoint: /api', () => {
  beforeAll(async (done) => {
    try {
      await transaction.start();
      await clearDB(transaction);
      await transaction.end();
      return done();
    } catch (error) {
      await transaction.rollback();
      return done(error);
    }
  });

  afterAll(async (done) => {
    try {
      endConnection();
      return done();
    } catch (error) {
      return done(error);
    }
  });

  beforeEach(async (done) => {
    try {
      await transaction.start();
      await buildTestDB(transaction);
      testAppId = (await transaction.query('SELECT * FROM Person WHERE username = \'testapp\'')).rows[0].person_id;
      testCompId = (await transaction.query('SELECT * FROM Competence WHERE name = \'testcomp\'')).rows[0].competence_id;
      await transaction.end();
      return done();
    } catch (error) {
      await transaction.rollback();
      return done(error);
    }
  });

  afterEach(async (done) => {
    try {
      await transaction.start();
      await clearDB(transaction);
      await transaction.end();
      return done();
    } catch (error) {
      await transaction.rollback();
      return done(error);
    }
  });

  describe('Endpoint: /api', () => {
    const fs = require('fs');
    test('GET => 200 It should return the API index page', async (done) => {
      try {
        const res = await axios.get(`http://localhost:${port}/api`);
        fs.readFile(path.join(__dirname, '..', 'src', 'views', 'index.html'), (err, fileData) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.data).toEqual(fileData.toString());
          return done();
        });
      } catch (error) {
        return done(error);
      }
    });
  });

  describe('Endpoint: /api/user', () => {
    test('POST => 201 It should create a new user in database', async (done) => {
      try {
        const res = await axios.post(`http://localhost:${port}/api/user`, {
          user: {
            name: 'name1',
            surname: 'surname1',
            ssn: 'ssn1',
            email: 'email@1.com',
            username: 'username1',
            password: 'password1',
          },
        });
        expect(res.status).toEqual(201);
        return done();
      } catch (error) {
        return done(error);
      }
    });
  });

  describe('Endpoint: /api/login', () => {
    test('POST => 200 It should return an auth token in response data', async (done) => {
      try {
        const res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testapp',
          password: 'testapp',
        });

        const { auth } = res.data;
        expect(res.status).toEqual(200);
        expect(auth).not.toBe(null);
        expect(auth.length).toBeGreaterThan(0);
        return done();
      } catch (error) {
        return done(error);
      }
    });
  });

  describe('Endpoint: /api/competence', () => {
    test('GET => 200 It should return an an array', async (done) => {
      try {
        let res = await axios.post(`http://localhost:${port}/api/login`, { username: 'testapp', password: 'testapp' });
        const { auth } = res.data;
        res = await axios.get(`http://localhost:${port}/api/competence`, {
          headers: {
            auth,
          },
        });
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.data)).toEqual(true);
        return done();
      } catch (error) {
        return done(error);
      }
    });
  });

  describe('Endpoint: /api/application', () => {
    async function createTestApplication() {
      await transaction.start();
      await transaction.query(`INSERT INTO Availability (person, from_date, to_date) VALUES (${testAppId}, '2020-02-20', '2020-02-21')`);
      await transaction.query(`INSERT INTO Competence_profile (person, competence, years_of_experience) VALUES (${testAppId}, ${testCompId}, 10)`);
      await transaction.query(`INSERT INTO Application (person) VALUES (${testAppId})`);
      await transaction.end();
    }
    test('POST => 201 It should successfully create an application', async (done) => {
      try {
        await transaction.start();
        await transaction.query('INSERT INTO Competence (name) VALUES (\'testcomp\')');
        await transaction.query('INSERT INTO Person (name, surname, ssn, email, username, password, role) '
          + 'VALUES (\'post\', \'post\', \'post\', \'post@post.com\', \'post\', \'post\', 2);');
        await transaction.end();
        let res = await axios.post(`http://localhost:${port}/api/login`, { username: 'post', password: 'post' });
        const headers = { auth: res.data.auth };
        const data = {
          form: {
            competences: [{ name: 'testcomp', years_of_experience: 10 }],
            availabilities: [{ from: '2020-06-14', to: '2020-06-30' }],
          },
        };
        res = await axios.post(`http://localhost:${port}/api/application`, data, { headers });
        expect(res.status).toEqual(201);
        return done();
      } catch (error) {
        return done(error);
      }
    });

    test('POST => 409 Create application if already exists for person', async (done) => {
      try {
        await createTestApplication(transaction);
        let res = await axios.post(`http://localhost:${port}/api/login`, { username: 'testapp', password: 'testapp' });
        const headers = { auth: res.data.auth };
        const data = {
          form: {
            competences: [{ name: 'testcomp', years_of_experience: 10 }],
            availabilities: [{ from: '2020-06-14', to: '2020-06-30' }],
          },
        };
        res = await axios.post(`http://localhost:${port}/api/application`, data, { headers });
        return done({ message: 'Should throw 409' });
      } catch (error) {
        expect(error.response.status).toEqual(409);
        return done();
      }
    });

    test('GET => 200 Should return applicant application in list', async (done) => {
      try {
        await createTestApplication(transaction);
        let res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testapp',
          password: 'testapp',
        });

        const headers = { auth: res.data.auth };
        res = await axios.get(`http://localhost:${port}/api/application`, { headers });
        expect(Array.isArray(res.data)).toEqual(true);
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/.*application\/json.*/);
        expect(Array.isArray(res.data[0].competences)).toEqual(true);
        expect(Array.isArray(res.data[0].availabilities)).toEqual(true);
        return done();
      } catch (error) {
        return done(error);
      }
    });
    test('GET => 200 Should return recruiter applications in list', async (done) => {
      try {
        await createTestApplication(transaction);
        let res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testrec',
          password: 'testrec',
        });

        const headers = { auth: res.data.auth };
        res = await axios.get(`http://localhost:${port}/api/application`, { headers });
        expect(Array.isArray(res.data)).toEqual(true);
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/.*application\/json.*/);
        return done();
      } catch (error) {
        return done(error);
      }
    });

    test('GET => 200 Recruiter search applicant by person ID', async (done) => {
      try {
        await createTestApplication(transaction);
        let res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testrec',
          password: 'testrec',
        });

        const headers = { auth: res.data.auth };
        const params = { personId: testAppId };
        res = await axios.get(`http://localhost:${port}/api/application`, { params, headers });
        expect(Array.isArray(res.data)).toEqual(true);
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/.*application\/json.*/);
        return done();
      } catch (error) {
        return done(error);
      }
    });

    test('GET => 200 Empty list if search person ID when no application in DB', async (done) => {
      try {
        let res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testrec',
          password: 'testrec',
        });

        const headers = { auth: res.data.auth };
        const params = { personId: testAppId };
        res = await axios.get(`http://localhost:${port}/api/application`, { params, headers });
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.data)).toEqual(true);
        expect(res.data.length).toEqual(0);
        expect(res.headers['content-type']).toMatch(/.*application\/json.*/);
        return done();
      } catch (error) {
        return done(error);
      }
    });

    test('GET => 401 Access application without authentication', async (done) => {
      try {
        await createTestApplication(transaction);
        await axios.get(`http://localhost:${port}/api/application`);
        return done({ message: 'Should throw error on 401' });
      } catch (error) {
        expect(error.response.status).toEqual(401);
        return done();
      }
    });

    test('GET => 403 Applicant search applicant by person ID', async (done) => {
      try {
        await createTestApplication(transaction);
        let res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testapp',
          password: 'testapp',
        });

        const headers = { auth: res.data.auth };
        const params = { personId: testAppId };
        res = await axios.get(`http://localhost:${port}/api/application`, { params, headers });
        return done({ message: 'Should throw error on 403' });
      } catch (error) {
        expect(error.response.status).toEqual(403);
        return done();
      }
    });
  });
});
