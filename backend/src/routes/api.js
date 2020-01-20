const express = require('express')
const config = require('../../config')
const router = express.Router()

/* GET home page. */
router.get('/db', function (req, res, next) {
  const { Client } = require('pg')
  const connectionString = config.db
  const client = new Client({
    connectionString,
    ssl: false
  })

  client.connect()
  client.query('DROP TABLE Cars', (err, result) => {
    if (err) throw err
    client.query('CREATE TABLE cars(id SERIAL PRIMARY KEY, name VARCHAR(255), price INT);', (err, result) => {
      if (err) throw err
      client.query('INSERT INTO cars(name, price) VALUES(\'Audi\', 52642);', (err, result) => {
        if (err) throw err
        client.query('SELECT * FROM cars;', (err, result) => {
          if (err) throw err
          let row
          for (row of result.rows) {
            console.log(JSON.stringify(row))
          }
          res.send('I am working ' + JSON.stringify(row))
        })
      })
    })
  })
})

router.get('/', function (req, res, next) {
  res.send('I am working')
})

module.exports = router
