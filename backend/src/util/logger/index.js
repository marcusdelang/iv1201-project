const env = process.env.NODE_ENV;
const fs = require('fs').promises;
const path = require('path')
const logFile = path.join(__dirname, '..', '..', '..', 'logs', 'log.log');
const errorFile = path.join(__dirname, '..', '..', '..', 'logs', 'error.log');

function log(message) {
    if (env === 'production') {
        return fs.writeFile(logFile, message)
    }
    return new Promise((resolve, reject) => {
        console.log(message);
        resolve();
    });
}

function error(message) {
    if (env === 'production') {
        return fs.writeFile(errorFile, message)
    }
    return new Promise((resolve, reject) => {
        console.error(message);
        resolve();
    });
}

module.exports = { log, error }