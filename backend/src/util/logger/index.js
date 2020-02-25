const fs = require('fs').promises;
const dateFormat = require('dateformat');
const path = require('path');

const env = process.env.NODE_ENV;
const logFile = path.join(__dirname, '..', '..', '..', 'logs', 'log.log');
const errorFile = path.join(__dirname, '..', '..', '..', 'logs', 'error.log');

function log(message) {
  if (env === 'production') {
    return fs.appendFile(logFile, `${timestamp(message)}\n`);
  }
  return new Promise((resolve, reject) => {
    console.log(timestamp(message));
    resolve();
  });
}

function error(message) {
  if (env === 'production') {
    return fs.appendFile(errorFile, `${timestamp(message)}\n`);
  }
  return new Promise((resolve, reject) => {
    console.error(timestamp(message));
    resolve();
  });
}

function timestamp(message) {
  return `${dateFormat(new Date(), 'dddd, mmmm dS, yyyy, h:MM:ss TT: ')} ${message}`;
}

module.exports = { log, error };
