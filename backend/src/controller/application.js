const logger = require('./../util/logger');
const {
  Application, exists: applicationExists, find: findApplication, getAll: getAllApplications,
} = require('../model/Application');


/**
 * Creates an application for the user.
 * @param {Object} form
 * @param {Object} user
 */
async function createApplication(form, user) {
  if (await applicationExists(user.person_id)) {
    throw { code: 409, message: 'Application already exists' };
  }
  try {
    await new Application(form, user).store();
    logger.log(`Stored application for user ${user.username}`);
  } catch (error) {
    throw { code: error.code, message: `Database Error ${error}` };
  }
}

/**
 * Returns a list of all applications for a user.
 * @param {Object} user
 * @return {Object[]} User applications
 */
async function getApplicationsWithToken(user) {
  if (user.role === 2) {
    const application = await getApplicantApplication(user.person_id);
    logger.log(`Applicant ${user.username} fetched his/her application.`);
    return application;
  }

  if (user.role === 1) {
    const applications = await getRecruiterApplications();
    logger.log(`Recruiter ${user.username} fetched all applications.`);
    return applications;
  }
  logger.log(`User ${user.username} tried to fetch appications but did not have 'appicant' or 'recruiter' role.`);
  return [];
}

/**
 * Returns the application for the person ID.
 * @param {number} personId
 * @return {Object[]}
 */
async function getApplicationWithId(personId) {
  const application = await getApplicantApplication(personId);
  return application;
}

async function getApplicantApplication(personId) {
  if (!await applicationExists(personId)) {
    logger.log(`An application for user with ID ${personId} does not exist.`);
    return [];
  }
  const application = await findApplication(personId);
  logger.log(`An application for user with ID ${personId} was fetched.`);
  return [application];
}

async function getRecruiterApplications() {
  return getAllApplications();
}


module.exports = { createApplication, getApplicationsWithToken, getApplicationWithId };
