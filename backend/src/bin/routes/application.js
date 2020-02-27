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
  try {
    let applications;
    if (req.query.personId) {
      if (!req.auth.isRecruiter) {
        return res.status(403).send('Can\'t touch this');
      }
      applications = await applicationController.getApplicationWithId(req.query.personId);
    } else {
      applications = await applicationController.getApplications(req.auth.user);
    }
    res.status(200).json(applications);
  } catch (error) {
    return next(error);
  }
});

router.put('/', [authenticate, authorize], async (req, res, next) => {
  try {
    if (!req.auth.isRecruiter) {
      // kan ta bort?
      return res.status(403).send('Can\'t touch this');
    }
    await applicationController.updateApplicationStatus(req.body, req.auth.user);
  } catch (error) {
    return next(error);
  }
  res.status(200).send('Application updated');
});
module.exports = router;
