const { Pool } = require('pg');
const { dbConnectionString } = require('./dbconfig');

const db = new Pool({
  connectionString: dbConnectionString,
});

async function endConnection() {
  await db.end();
}

async function startTransaction() {
  const client = await db.connect();
  await client.query('BEGIN');
  return client;
}

async function endTransaction(client) {
  await client.query('COMMIT');
  client.release();
}

async function rollbackTransaction(client) {
  await client.query('ROLLBACK');
  client.release();
}

/**
 * Class representing a transaction.
 */
class Transaction {
  /**
   * Create a transaction.
   */
  constructor() {
    this.start = async () => {
      this.client = await startTransaction();
      this.active = true;
    };
    this.query = async (query, values) => {
      const res = await this.client.query(query, values);
      return res;
    };
    this.end = async () => {
      await endTransaction(this.client);
      this.active = false;
    };
    this.rollback = async () => {
      await rollbackTransaction(this.client);
      this.active = false;
    };
  }
}

module.exports = {
  Transaction,
  endConnection,
};
