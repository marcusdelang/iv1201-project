const axios = require('axios')
const path = require('path')
const config = require('../src/config')
const { port } = config

const { Client } = require('pg')
const { dbConnectionString } = require('../src/integration/dbconfig')
const db = new Client({
  connectionString: dbConnectionString
})
let testAppId
let testRecId
let testCompId

async function clearDB() {
  return Promise.all([
    db.query('DELETE FROM Competence_profile *'),
    db.query('DELETE FROM Competence *'),
    db.query('DELETE FROM Application *'),
    db.query('DELETE FROM Availability *'),
    db.query('DELETE FROM Person *')
  ])
}

async function buildTestDB() {
  return Promise.all([
    db.query('INSERT INTO Competence (name) VALUES (\'testcomp\')'),
    db.query('INSERT INTO Person (name, surname, ssn, email, username, password, role_id) ' +
      'VALUES (\'testapp\', \'testapp\', \'testapp\', \'testapp@mail.com\', \'testapp\', \'testapp\', 2);'),
    db.query('INSERT INTO Person (name, surname, ssn, email, username, password, role_id) ' +
      'VALUES (\'testrec\', \'testrec\', \'testrec\', \'testrec@mail.com\', \'testrec\', \'testrec\', 1);')
  ])
}

describe('Endpoint: /api', () => {
  beforeAll(async done => {
    try {
      db.connect()
      await clearDB()
      return done()
    } catch (error) {
      return done(error)
    }
  })

  afterAll(async done => {
    try {
      db.end()
      return done()
    } catch (error) {
      return done(error)
    }
  })

  beforeEach(async done => {
    try {
      await buildTestDB()
      testAppId = (await db.query('SELECT * FROM Person WHERE username = \'testapp\'')).rows[0].person_id
      testRecId = (await db.query('SELECT * FROM Person WHERE username = \'testrec\'')).rows[0].person_id
      testCompId = (await db.query('SELECT * FROM Competence WHERE name = \'testcomp\'')).rows[0].competence_id
      return done()
    } catch (error) {
      return done(error)
    }
  })

  afterEach(async done => {
    try {
      await clearDB()
      return done()
    } catch (error) {
      return done(error)
    }
  })

  describe('Endpoint: /api', () => {
    const fs = require('fs')
    test('GET => 200 It should return the API index page', async (done) => {
      try {
        const res = await axios.get(`http://localhost:${port}/api`)
        fs.readFile(path.join(__dirname, '..', 'src', 'views', 'index.html'), (err, fileData) => {
          if (err) return done(err)
          expect(res.status).toEqual(200)
          expect(res.data).toEqual(fileData.toString())
          return done()
        })
      } catch (error) {
        return done(error)
      }
    })
  })

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
            password: 'password1'
          }
        })
        expect(res.status).toEqual(201)
        await db.query('DELETE FROM Person WHERE username = \'username1\'')
        return done()
      } catch (error) {
        return done(error)
      }
    })
  })

  describe('Endpoint: /api/login', () => {
    test('POST => 200 It should return an auth token in response data', async (done) => {
      try {
        const res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testapp',
          password: 'testapp'
        })

        const auth = res.data.auth
        expect(res.status).toEqual(200)
        expect(auth).not.toBe(null)
        expect(auth.length).toBeGreaterThan(0)
        return done()
      } catch (error) {
        return done(error)
      }
    })
  })

  describe('Endpoint: /api/competence', () => {
    test('GET => 200 It should return an an array', async (done) => {
      try {
        let res = await axios.post(`http://localhost:${port}/api/login`, { username: 'testapp', password: 'testapp' })
        const auth = res.data.auth
        res = await axios.get(`http://localhost:${port}/api/competence`, {
          headers: {
            auth: auth
          }
        })
        expect(res.status).toEqual(200)
        expect(Array.isArray(res.data)).toEqual(true)
        return done()
      } catch (error) {
        return done(error)
      }
    })
  })

  describe('Endpoint: /api/application', () => {
    test('POST => 201 It should successfully create an application', async (done) => {
      try {
        await db.query('INSERT INTO Competence (name) VALUES (\'testcomp\')')
        let res = await axios.post(`http://localhost:${port}/api/login`, { username: 'testapp', password: 'testapp' })
        const headers = { auth: res.data.auth }
        const data = {
          form: {
            competences: [{ name: 'testcomp', years_of_experience: 10 }],
            availabilities: [{ from: '2020-06-14', to: '2020-06-30' }]
          }
        }
        res = await axios.post(`http://localhost:${port}/api/application`, data, { headers })
        expect(res.status).toEqual(201)
        return done()
      } catch (error) {
        return done(error)
      }
    })

    test('GET => 200 Should return applicant application in list', async (done) => {
      try {
        await db.query(`INSERT INTO Availability (person_id, from_date, to_date) VALUES (${testAppId}, '2020-02-20', '2020-02-21')`)
        await db.query(`INSERT INTO Competence_profile (person_id, competence_id, years_of_experience) VALUES (${testAppId}, ${testCompId}, 10)`)
        await db.query(`INSERT INTO Application (person) VALUES (${testAppId})`)

        let res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testapp',
          password: 'testapp'
        })

        const headers = { auth: res.data.auth }
        res = await axios.get(`http://localhost:${port}/api/application`, { headers })
        expect(Array.isArray(res.data)).toEqual(true)
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/.*application\/json.*/)
        expect(Array.isArray(res.data[0].competences)).toEqual(true)
        expect(Array.isArray(res.data[0].availabilities)).toEqual(true)
        return done()
      } catch (error) {
        return done(error)
      }
    })
    test('GET => 200 Should return recruiter applications in list', async (done) => {
      try {
        await db.query(`INSERT INTO Availability (person_id, from_date, to_date) VALUES (${testAppId}, '2020-02-20', '2020-02-21')`)
        await db.query(`INSERT INTO Competence_profile (person_id, competence_id, years_of_experience) VALUES (${testAppId}, ${testCompId}, 10)`)
        await db.query(`INSERT INTO Application (person) VALUES (${testAppId})`)

        let res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testrec',
          password: 'testrec'
        })

        const headers = { auth: res.data.auth }
        res = await axios.get(`http://localhost:${port}/api/application`, { headers })
        expect(Array.isArray(res.data)).toEqual(true)
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/.*application\/json.*/)
        return done()
      } catch (error) {
        return done(error)
      }
    })
  })
})
