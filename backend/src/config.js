const port = process.env.PORT
const dbConnectionString = process.env.DATABASE_URL

module.exports = {
  port: port || '3001',
  dbConnectionString: dbConnectionString
}

