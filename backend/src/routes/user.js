const express = require('express');

const router = express.Router();
const userController = require('../controller/user');

router.post('/', async (req, res) => {
  const {
    name, surname, ssn, username, password, email,
  } = req.body.user;
  try {
    await userController.newUser({
      name, surname, ssn, username, password, email,
    });
  } catch (error) {
    res.status(error.code).send(error.message);
  }
  res.status(201).send();
});

module.exports = router;
