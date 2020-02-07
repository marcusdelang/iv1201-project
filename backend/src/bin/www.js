const app = require('../app')
const { port } = require('../config')

const server = require('http').createServer(app)
server.listen(port, () => {
  console.log('Server listening on:', port)
})

module.exports = server
