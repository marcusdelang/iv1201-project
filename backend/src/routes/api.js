const express = require('express')
const path = require('path')
const router = express.Router()
const userRoute = require('./user')
const apiIndexpath = path.join(__dirname, '..', 'views', 'index.html')

router.use('/user', userRoute)
router.get('/', (req, res) => {
  res.sendFile(apiIndexpath)
})

module.exports = router
