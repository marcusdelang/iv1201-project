const axios = require('axios')
const path = require('path')
const config = require('../src/config')
const { port } = config

const user = {
    name: 'testname',
    surname: 'testsurname',
    ssn: 'testssn',
    email: 'test@mail.com',
    username: 'testusername',
    password: 'testpassword'
  }


describe('Endpoint: /api', () => {
  const fs = require('fs')
  test('GET => It should return the API index page', async (done) => {
    const res = await axios.get(`http://localhost:${port}/api`)
    fs.readFile(path.join(__dirname, '..', 'src', 'views', 'index.html'), (err, fileData) => {
      if (err) throw err
      expect(res.data).toEqual(fileData.toString())
      done()
    })
  })
})

describe('Endpoint: /api/user', () => {
  test('POST => It should create a new user in database', async (done) => {
    const res = await axios.post(`http://localhost:${port}/api/user`, { user })
    expect(res.statusCode === 201)
    done()
  })
})
