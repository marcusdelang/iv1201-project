const express = require('express')
const router = express.Router()
const applicationController = require('../controller/application')
const authUtil = require('../controller/authUtil')

router.post('/', async (req, res) => {
  const token = req.headers.auth
  if (!authUtil.isAuthenticated(token)) {
    const error = { code: 401, message: 'Please sign in' }
    return res.status(error.code).send(error.message)
  }
  try {
    await applicationController.createApplication(req.body.form, authUtil.getUser(token))
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
  res.status(201).send('Application created')
})

router.get('/', async (req, res) => {
  if (!authUtil.isAuthenticated(req.headers.auth)) {
    return res.status(401).send('Please sign in')
  }

  let applications
  try {
    if (req.query && req.query.personId && authUtil.isRecruiter(req.headers.auth)) {
      applications = await applicationController.getApplicationWithId(req.query.personId)
    } else if (req.query && req.query.personId && !authUtil.isRecruiter(req.headers.auth)) {
      return res.status(403).send('Can\'t touch this')
    } else {
      applications = await applicationController.getApplicationsWithToken(authUtil.getUser(req.headers.auth))
    }
  } catch (error) {
    console.log(error)
    return res.status(error.code).send(error.message)
  }
  res.status(200).json(applications)
})

module.exports = router
