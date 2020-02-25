const express = require('express');
const validator = require('../../util/middlewares/validator');

const router = express.Router();
const applicationController = require('../../controller/application');
const authUtil = require('../../controller/authUtil');

router.post('/', validator.post.application, async (req, res, next) => {
  const token = req.headers.auth;
  if (!authUtil.isAuthenticated(token)) {
    const error = { code: 401, message: 'Please sign in' };
    return next(error);
  }
  try {
    await applicationController.createApplication(req.body.form, authUtil.getUser(token));
  } catch (error) {
    return next(error)
  }
  res.status(201).send('Application created');
});

router.get('/', async (req, res, next) => {
  if (!authUtil.isAuthenticated(req.headers.auth)) {
    const error = { code: 401, message: 'Please sign in' };
    return next(error);
  }

  let applications;
  try {
    if (req.query && req.query.personId && authUtil.isRecruiter(req.headers.auth)) {
      applications = await applicationController.getApplicationWithId(req.query.personId);
    } else if (req.query && req.query.personId && !authUtil.isRecruiter(req.headers.auth)) {
      return res.status(403).send('Can\'t touch this');
    } else {
      applications = await applicationController.getApplicationsWithToken(authUtil.getUser(req.headers.auth));
    }
  } catch (error) {
    return next(error);
  }
  res.status(200).json(applications);
});

module.exports = router;
