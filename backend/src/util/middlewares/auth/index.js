const authUtil = require('../../../controller/authUtil');

async function authenticate(req, res, next) {
  try {
    const token = req.headers.auth;
    if (!await authUtil.isAuthenticated(token)) {
      const error = { code: 401, message: 'Please sign in' };
      return next(error);
    }
    req.auth = {
      user: await authUtil.getUser(token),
    };
    next();
  } catch (error) {
    next(error);
  }
}

async function authorize(req, res, next) {
  try {
    const token = req.headers.auth;
    if (!await authUtil.isAuthenticated(token)) {
      throw { code: 401, message: 'Please sign in' };
    }
    const user = await authUtil.getUser(token);
    req.auth = {
      user,
      isRecruiter: user.role === 1,
    };
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticate,
  authorize,
};
