const path = require('path');

const port = process.env.PORT;
const dbConnectionString = process.env.DATABASE_URL;
const environment = process.env.NODE_ENV;
const logFilePath = path.join('logs');

let logLevel;
if (environment === 'heroku') {
  logLevel = 'console';
} else if (environment === 'production') {
  logLevel = 'file';
} else if (environment === 'development') {
  logLevel = 'console';
} else if (environment === 'test') {
  logLevel = 'none';
}

module.exports = {
  port: port || '3000',
  dbConnectionString,
  environment,
  logLevel,
  logFilePath,
};
