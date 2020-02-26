const logger = require('../../logger');

function errorHandler(error, req, res, next) {
  logger.error(`${req.ip} ->` + ` status: ${error.status || error.code} ERROR: ${error.message}`);
  const errorObject = {
    cause: error.cause,
    field: error.field
  }
  res.status(error.status || error.code || 500).send(errorObject);
}

module.exports = errorHandler;
