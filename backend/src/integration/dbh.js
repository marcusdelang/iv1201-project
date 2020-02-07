const { Client } = require('pg')
const { dbConnectionString } = require('./dbconfig')

const db = new Client({
  connectionString: dbConnectionString
})
db.connect()

module.exports = db
