const express = require('express');
const validate = require('../../util/middlewares/validate');

const router = express.Router();
const authController = require('../../controller/auth');

router.post('/',[validate.login.credentials], async (req, res, next) => {
  let token;
  const { username, password } = req.body;
  try {
    token = await authController.auth({ username, password });
  } catch (error) {
    return next(error);
  }
  res.send(token);
});

module.exports = router;
