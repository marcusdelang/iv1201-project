const express = require('express')
const router = express.Router()
const { User } = require('../model/User')

router.post('/', async (req, res) => {
  const { name, surname, ssn, username, password, email } = req.body.user
  const newUser = new User({ name, surname, ssn, username, password, email })
  await newUser.store()
  res.status(201).send()
})

module.exports = router
