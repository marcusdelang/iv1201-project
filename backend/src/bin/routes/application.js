const express = require('express');
const validate = require('../../util/middlewares/validate');
const { authenticate, authorize } = require('../../util/middlewares/auth');

const router = express.Router();
const applicationController = require('../../controller/application');

router.post('/', [authenticate, validate.post.application], async (req, res, next) => {
  try {
    await applicationController.createApplication(req.body.form, req.auth.user);
  } catch (error) {
    return next(error);
  }
  res.status(201).send('Application created');
});

router.get('/', [authenticate, authorize], async (req, res, next) => {
  let applications;
  try {
    if (req.query && req.query.personId && req.auth.isRecruiter) {
      applications = await applicationController.getApplicationWithId(req.query.personId);
    } else if (req.query && req.query.personId && !req.auth.isRecruiter) {
      return res.status(403).send('Can\'t touch this');
    } else {
      applications = await applicationController.getApplicationsWithToken(req.auth.user);
    }
  } catch (error) {
    return next(error);
  }
  res.status(200).json(applications);
});

module.exports = router;
