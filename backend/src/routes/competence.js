const express = require('express');
const validator = require('../validator')
const router = express.Router();
const authUtil = require('../controller/authUtil');
const competenceController = require('../controller/competence');

router.get('/', validator.post.application, async (req, res) => {
  if (!authUtil.isAuthenticated(req.headers.auth)) {
    const error = { code: 401, message: 'Please sign in' };
    return res.status(error.code).send(error.message);
  }
  let competences = [];
  try {
    competences = await competenceController.getAll();
  } catch (error) {
    return res.status(error.status).send(error.message);
  }
  res.status(200).send(competences);
});

module.exports = router;
