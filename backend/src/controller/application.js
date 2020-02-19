const { Application, find: findApplication, exists: applicationExists } = require('../model/Application')
const authUtil = require('../controller/authUtil')

function createApplication (form, user) {
  if (applicationExists(user.person_id)) {
    throw { code: 409, message: 'Application already exists' }
  }
  try {
    new Application(form).store()
  } catch (error) {
    throw { code: error.code, message: `Database Error ${error}` }
  }
}

module.exports = { createApplication }
