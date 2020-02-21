const { Application, exists: applicationExists, find: findApplication, getAll: getAllApplications } = require('../model/Application')

async function createApplication (form, user) {
  if (await applicationExists(user.person_id)) {
    throw { code: 409, message: 'Application already exists' }
  }
  try {
    await new Application(form, user).store()
  } catch (error) {
    throw { code: error.code, message: `Database Error ${error}` }
  }
}

async function getApplicationsWithToken (user) {
  if (user.role === 2) {
    const application = await getApplicantApplication(user.person_id)
    return application
  }

  if (user.role === 1) {
    const applications = await getRecruiterApplications()
    return applications
  }
}

async function getApplicationWithId (personId) {
  const application = await getApplicantApplication(personId)
  return application
}

async function getRecruiterApplications () {
  return getAllApplications()
}

async function getApplicantApplication (personId) {
  if (!await applicationExists(personId)) {
    return []
  }
  const application = await findApplication(personId)
  return [application]
}

module.exports = { createApplication, getApplicationsWithToken, getApplicationWithId }
