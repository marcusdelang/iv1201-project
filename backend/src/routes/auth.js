const express = require('express')
const router = express.Router()
const authController = require('../controller/auth')

router.post('/', async (req, res) => {
  let token;
  const { username, password } = req.body
  try {
    token = await authController.auth({ username, password });
  } catch (error) {
    res.status(error.code).send(error.message)
  }
  res.send(token);
})

module.exports = router
