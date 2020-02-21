const express = require('express');
const path = require('path');

const router = express.Router();
const routes = require('./routes');

const apiIndexpath = path.join(__dirname, '..', 'views', 'index.html');

router.use('/login', routes.auth);
router.use('/user', routes.user);
router.use('/competence', routes.competence);
router.use('/application', routes.application);
router.get('/', (req, res) => {
  res.sendFile(apiIndexpath);
});

module.exports = router;
