const express = require('express');
const path = require('path');

const router = express.Router();
const routes = require('./routes');

router.use('/login', routes.auth);
router.use('/user', routes.user);
router.use('/competence', routes.competence);
router.use('/application', routes.application);

module.exports = router;
