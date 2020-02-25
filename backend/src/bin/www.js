let server = require('http');
const app = require('./app');
const { port } = require('../config');
const logger = require('../util/logger');

server = server.createServer(app);

server.listen(port, () => {
 logger.log('Server listening on: ' + port);
});

module.exports = server;
