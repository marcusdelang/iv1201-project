const { Application, exists: applicationExists, find: findApplication, getAll: getAllApplications } = require('../model/Application')

async function createApplication(form, user) {
  if (await applicationExists(user.person_id)) {
    throw { code: 409, message: 'Application already exists' }
  }
  try {
    await new Application(form, user).store()
  } catch (error) {
    throw { code: error.code, message: `Database Error ${error}` }
  }
}

async function getApplications(user) {
  if (user.role_id === 2) {
    const application = await getApplicantApplication(user)
    return [application];
  }

  if (user.role_id === 1) {
    const applications = await getRecruiterApplications()
    return applications
  }
}

async function getRecruiterApplications() {
  return getAllApplications()
}

async function getApplicantApplication(user) {
  if (!await applicationExists(user.person_id)) {
    return []
  }
  return findApplication(user.person_id)
}

module.exports = { createApplication, getApplications }
