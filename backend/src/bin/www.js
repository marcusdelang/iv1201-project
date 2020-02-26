let server = require('http');
const app = require('./app');
const { port, logLevel } = require('../config');

server = server.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on: ${port}`);
  console.log(`Logging to: ${logLevel}`);
});

module.exports = server;
