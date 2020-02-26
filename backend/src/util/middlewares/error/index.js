const logger = require('../../logger');

function errorHandler(error, req, res, next) {
  logger.error(`${req.ip} ->` + ` status: ${error.code} ERROR: ${error.message}`);
  res.status(error.code || 500).send(error.message);
}

module.exports = errorHandler;
