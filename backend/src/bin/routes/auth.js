const express = require('express');

const router = express.Router();
const authController = require('../../controller/auth');

router.post('/', async (req, res, next) => {
  let token;
  const { username, password } = req.body;
  try {
    token = await authController.auth({ username, password });
  } catch (error) {
    return next(error)
  }
  res.send(token);
});

module.exports = router;
