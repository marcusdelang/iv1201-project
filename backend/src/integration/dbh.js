const { Pool } = require('pg')
const { dbConnectionString } = require('./dbconfig')

const db = new Pool({
  connectionString: dbConnectionString
})

async function startTransaction() {
  const client = await db.connect()
  await client.query('BEGIN')
  return client
}

async function endTransaction(client) {
  await client.query('COMMIT')
  client.release()
}

async function rollbackTransaction(client) {
  await client.query('ROLLBACK')
  client.release()
}

class Transaction {
  start = async () => {
    this.client = await startTransaction()
  }
  query = async (query, values) => {
    const res = await this.client.query(query, values)
    return res
  }
  end = async () => {
    await endTransaction(this.client)
  }
  rollback = async () => {
    await rollbackTransaction(this.client)
  }
}

module.exports = {
  Transaction
}
