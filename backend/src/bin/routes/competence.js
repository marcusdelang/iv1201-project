const express = require('express');

const router = express.Router();
const authUtil = require('../../controller/authUtil');
const competenceController = require('../../controller/competence');

router.get('/', async (req, res, next) => {
  if (!authUtil.isAuthenticated(req.headers.auth)) {
    const error = { code: 401, message: 'Please sign in' };
    return next(error);
  }
  let competences = [];
  try {
    competences = await competenceController.getAll();
  } catch (error) {
    return next(error);
  }
  res.status(200).send(competences);
});

module.exports = router;
