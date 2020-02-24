let server = require('http');
const app = require('../app');
const { port } = require('../config');

server = server.createServer(app);

server.listen(port, () => {
  console.log('Server listening on:', port);
});

module.exports = server;
