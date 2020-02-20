const axios = require('axios')
const path = require('path')
const config = require('../src/config')
const { port } = config

const { Client } = require('pg')
const { dbConnectionString } = require('../src/integration/dbconfig')
const db = new Client({
  connectionString: dbConnectionString
})

describe('Endpoint: /api', () => {
  beforeAll(async (done) => {
    try {
      db.connect()
      await db.query('INSERT INTO Person (name, surname, ssn, email, username, password, role_id) ' +
        'VALUES (\'testname\', \'testsurname\', \'testssn\', \'test@mail.com\', \'testusername\', \'testpassword\', 2);')
    } catch (error) {
      return done(error)
    }
    console.log("DONE beforeALL")
    done()
  })

  afterAll(async (done) => {
    try {
      await db.query('DELETE FROM Person WHERE username = \'testusername\'');
      db.end()
    } catch (error) {
      return done(error)
    }
    console.log("DONE afterALL")
    done()
  })

  describe('Endpoint: /api', () => {
    const fs = require('fs')
    test('GET => 200 It should return the API index page', async (done) => {
      const res = await axios.get(`http://localhost:${port}/api`)
      fs.readFile(path.join(__dirname, '..', 'src', 'views', 'index.html'), (err, fileData) => {
        if (err) return done(err)
        expect(res.statusCode === 200)
        expect(res.data).toEqual(fileData.toString())
        done()
      })
    })
  })
  
  describe('Endpoint: /api/user', () => {
    test('POST => 201 It should create a new user in database', async (done) => {
      const res = await axios.post(`http://localhost:${port}/api/user`, {
        user: {
          name: 'name1',
          surname: 'surname1',
          ssn: 'ssn1',
          email: 'email@1.com',
          username: 'username1',
          password: 'password1'
        }
      }).then(res => {
        expect(res.statusCode === 201)
        db.query('DELETE FROM Person WHERE username = \'username1\'');
        done()
      }).catch(error => done(error));
    })
  })
  
  describe('Endpoint: /api/login', () => {
    test('POST => 200 It should return an auth token in response data', async (done) => {
      const res = await axios.post(`http://localhost:${port}/api/login`, {
        username: 'testusername',
        password: 'testpassword'
      })
  
      const auth = res.data.auth
      expect(res.statusCode === 200)
      expect(auth !== null)
      expect(auth.length > 0)
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
          'auth': auth
        }
      })
      expect(res.statusCode === 200)
      expect(Array.isArray(res.data))
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
      await db.query('INSERT INTO Competence (name) VALUES (\'testcomp\')');

      const data = {
        form: {
          competences: [{ name: "testcomp", years_of_experience: 10 }],
          availabilities: [{ from: "2020-06-14", to: "2020-06-30" }]
        }
      }
      const headers = { 'auth': auth }
      try {
        res = await axios.post(`http://localhost:${port}/api/application`, data, { headers })
      } catch (error) {
        return done(error)
      }
      expect(res.statusCode !== 201)
      res = await db.query('SELECT person_id FROM PERSON WHERE username = \'testusername\'');
      const personId = res.rows[0].person_id
      await db.query(`DELETE FROM Availability WHERE person_id = ${personId}`);
      await db.query(`DELETE FROM Application WHERE person = ${personId}`);
      await db.query(`DELETE FROM Competence_profile WHERE person_id = ${personId}`);
      await db.query('DELETE FROM Competence WHERE name = \'testcomp\'');
      done()
    })
  })
})

