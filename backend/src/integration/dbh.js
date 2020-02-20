const { Pool } = require('pg')
const { dbConnectionString } = require('./dbconfig')

const db = new Pool({
  connectionString: dbConnectionString
})
db.connect()

module.exports = db
