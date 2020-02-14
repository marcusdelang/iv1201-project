const express = require('express')
const router = express.Router()
const authUtil = require('../controller/authUtil')
const userController = require('../controller/user')

router.get('/', async (req, res) => {
  const token = req.headers.auth
  if (!authUtil.isAuthenticated(token)) {
    const error = {code: 401, message: 'Please sign in'}
    return res.status(error.code).send(error.message)
  }
  const { name, surname, ssn, username, password, email } = req.body.user
  try {
    await userController.newUser({ name, surname, ssn, username, password, email })
  } catch (error) {
    res.status(error.code).send(error.message)
  }
  res.status(201).send()
})

module.exports = router
