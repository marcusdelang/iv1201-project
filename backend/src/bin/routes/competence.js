const express = require('express');
const { authenticate } = require('../../util/middlewares/auth');

const router = express.Router();
const competenceController = require('../../controller/competence');

router.get('/', [authenticate], async (req, res, next) => {
  let competences = [];
  try {
    competences = await competenceController.getAll();
  } catch (error) {
    return next(error);
  }
  res.status(200).send(competences);
});

module.exports = router;
