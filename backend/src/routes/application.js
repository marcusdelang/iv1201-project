const express = require('express')
const router = express.Router()
//const applicationController = require('../controller/application')
//const authUtil = require('../controller/authUtil')

router.post('/', async (req, res) => {
  const token = req.headers.auth
  if (!authUtil.isAuthenticated(token)) {
    const error = { code: 401, message: 'Please sign in' }
    res.status(error.code).send(error.message)
  }
  try {
    applicationController.createApplication(req.body.form, authUtil.getUser(token))
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
  res.send(token).status(201)
})


module.exports = router
