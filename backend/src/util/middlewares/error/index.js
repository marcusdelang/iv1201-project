const logger = require('../../logger');

function errorHandler(error, req, res, next) {
    logger.error(req.ip + ' ->' + ' ERROR: ' + error.message + ' status: ' + error.code);
    res.status(error.code || 500).send(error.message);
  }

  module.exports = errorHandler;