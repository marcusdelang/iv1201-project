const axios = require('axios')
const path = require('path')
const config = require('../src/config')
const { port } = config

const { Client } = require('pg')
const { dbConnectionString } = require('../src/integration/dbconfig')
const db = new Client({
  connectionString: dbConnectionString
})
let testUserId
let testCompId

async function clearDB () {
  return Promise.all([
    db.query('DELETE FROM Competence_profile *'),
    db.query('DELETE FROM Competence *'),
    db.query('DELETE FROM Application *'),
    db.query('DELETE FROM Availability *'),
    db.query('DELETE FROM Person *')
  ])
}

async function buildTestDB () {
  return Promise.all([
    db.query('INSERT INTO Competence (name) VALUES (\'testcomp\')'),
    db.query('INSERT INTO Person (name, surname, ssn, email, username, password, role_id) ' +
      'VALUES (\'testname\', \'testsurname\', \'testssn\', \'test@mail.com\', \'testusername\', \'testpassword\', 2);')
  ])
}

describe('Endpoint: /api', () => {
  beforeAll(async (done) => {
    try {
      db.connect()
      await clearDB()
      await buildTestDB()
      testUserId = (await db.query('SELECT * FROM Person WHERE username = \'testusername\'')).rows[0].person_id
      testCompId = (await db.query('SELECT * FROM Competence WHERE name = \'testcomp\'')).rows[0].competence_id
      console.log('DONE Setup')
      done()
    } catch (error) {
      return done(error)
    }
  })

  afterAll(async (done) => {
    try {
      await clearDB()
      db.end()
      console.log('DONE Cleanup')
      done()
    } catch (error) {
      return done(error)
    }
  })

  describe('Endpoint: /api', () => {
    const fs = require('fs')
    test('GET => 200 It should return the API index page', async (done) => {
      const res = await axios.get(`http://localhost:${port}/api`)
      fs.readFile(path.join(__dirname, '..', 'src', 'views', 'index.html'), (err, fileData) => {
        if (err) return done(err)
        expect(res.status).toEqual(200)
        expect(res.data).toEqual(fileData.toString())
        done()
      })
    })
  })

  describe('Endpoint: /api/user', () => {
    test('POST => 201 It should create a new user in database', async (done) => {
      axios.post(`http://localhost:${port}/api/user`, {
        user: {
          name: 'name1',
          surname: 'surname1',
          ssn: 'ssn1',
          email: 'email@1.com',
          username: 'username1',
          password: 'password1'
        }
      }).then(async res => {
        expect(res.status).toEqual(201)
        await db.query('DELETE FROM Person WHERE username = \'username1\'')
        return done()
      }).catch(error => done(error))
    })
  })

  describe('Endpoint: /api/login', () => {
    test('POST => 200 It should return an auth token in response data', async (done) => {
      const res = await axios.post(`http://localhost:${port}/api/login`, {
        username: 'testusername',
        password: 'testpassword'
      })

      const auth = res.data.auth
      expect(res.status).toEqual(200)
      expect(auth).not.toBe(null)
      expect(auth.length).toBeGreaterThan(0)
      done()
    })
  })

  describe('Endpoint: /api/competence', () => {
    test('GET => 200 It should return an an array', async (done) => {
      let res = await axios.post(`http://localhost:${port}/api/login`, {
        username: 'testusername',
        password: 'testpassword'
      })
      const auth = res.data.auth
      res = await axios.get(`http://localhost:${port}/api/competence`, {
        headers: {
          auth: auth
        }
      })
      expect(res.status).toEqual(200)
      expect(Array.isArray(res.data)).toEqual(true)
      done()
    })
  })

  describe('Endpoint: /api/application', () => {
    test('POST => 201 It should successfully create an application', async (done) => {
      let res
      try {
        res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testusername',
          password: 'testpassword'
        })
      } catch (error) {
        return done(error)
      }
      const auth = res.data.auth
      await db.query('INSERT INTO Competence (name) VALUES (\'testcomp\')')

      const data = {
        form: {
          competences: [{ name: 'testcomp', years_of_experience: 10 }],
          availabilities: [{ from: '2020-06-14', to: '2020-06-30' }]
        }
      }
      const headers = { auth: auth }
      try {
        res = await axios.post(`http://localhost:${port}/api/application`, data, { headers })
      } catch (error) {
        return done(error)
      }
      expect(res.status).toEqual(201)
      await db.query(`DELETE FROM Availability WHERE person_id = ${testUserId}`)
      await db.query(`DELETE FROM Application WHERE person = ${testUserId}`)
      await db.query(`DELETE FROM Competence_profile WHERE person_id = ${testUserId}`)
      done()
    })

    test('GET => 200 Should return applicant application in list', async (done) => {
      try {
        await db.query(`INSERT INTO Availability (person_id, from_date, to_date) VALUES (${testUserId}, '2020-02-20', '2020-02-21')`)
        await db.query(`INSERT INTO Competence_profile (person_id, competence_id, years_of_experience) VALUES (${testUserId}, ${testCompId}, 10)`)
        await db.query(`INSERT INTO Application (person) VALUES (${testUserId})`)

        let res = await axios.post(`http://localhost:${port}/api/login`, {
          username: 'testusername',
          password: 'testpassword'
        })

        const headers = { auth: res.data.auth }
        res = await axios.get(`http://localhost:${port}/api/application`, { headers })
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toEqual('application/json')
        expect(Array.isArray(res.data)).toEqual(true)
        return done()
      } catch (error) {
        return done(error)
      }
    })
  })
})
