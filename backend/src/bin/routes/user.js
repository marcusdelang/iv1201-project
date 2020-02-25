const express = require('express');

const router = express.Router();
const userController = require('../../controller/user');

router.post('/', async (req, res, next) => {
  const {
    name, surname, ssn, username, password, email,
  } = req.body.user;
  try {
    await userController.createNewUser({
      name, surname, ssn, username, password, email,
    });
  } catch (error) {
    return next(error);
  }
  res.status(201).send();
});

module.exports = router;
