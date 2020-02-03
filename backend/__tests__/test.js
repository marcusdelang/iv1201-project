const axios = require('axios')
const path = require('path')
const app = require('../src/app')
const config = require('../src/config')

const { port } = config
let server
let db

describe('Endpoints: ', () => {
  beforeAll((done) => {
    db = require('../src/integration/dbh')
    db.query('DELETE FROM Person;')
    server = require('http').createServer(app)
    server.listen(port, done)
  })

  afterAll((done) => {
    db.end()
    server.close(done)
  })

  describe('Endpoint: /api', () => {
    const fs = require('fs')
    test('GET => It should return the API index page', async (done) => {
      const res = await axios.get('http://localhost:3001/api/')
      fs.readFile(path.join(__dirname, '..', 'src', 'views', 'index.html'), (err, fileData) => {
        expect(res.data).toEqual(fileData.toString())
        done()
      })
    })
  })

  describe('Endpoint: /api/user', () => {
    test('POST => It should create a new user in database', async (done) => {
      const res = await axios.post('http://localhost:3001/api/user', {
        user: {
          name: 'testname',
          surname: 'testsurname',
          ssn: 'testssn',
          email: 'test@mail.com',
          username: 'testusername',
          password: 'testpassword'
        }
      })
      expect(res.statusCode === 201)
      done()
    })
  })
})


