const fs = require('fs').promises;
const dateFormat = require('dateformat');
const path = require('path');
const { logLevel, logFilePath } = require('../../config');

const logFile = path.join(logFilePath, 'log.log');
const errorFile = path.join(logFilePath, 'error.log');

function log(message) {
  if (logLevel === 'file') {
    return fs.appendFile(logFile, `${timestamp(message)}\n`);
  }
  return new Promise((resolve, reject) => {
    console.log(timestamp(message));
    resolve();
  });
}

function error(message) {
  if (logLevel === 'file') {
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
