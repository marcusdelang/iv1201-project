const express = require('express')
const router = express.Router()
const User = require('../model/User')

router.post('/', async (req, res) => {
  const userDetails = { name, surname, ssn, username, password, email } = req.body.user
  const newUser = new User(userDetails)
  await newUser.store()
  res.status(201).send()
})

module.exports = router
