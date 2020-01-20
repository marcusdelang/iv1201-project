
const axios = require('axios')

describe('Filter function', () => {
  let server

  beforeAll(() => {
    console.log(__dirname)
    server = require('../src/bin/www')
  })

  afterAll(() => {
    server.close()
  })

  test('it should pass', async () => {
    const res = await axios.get('http://localhost:3001/api')
    expect(res.data).toEqual('I am working')
  })
})
