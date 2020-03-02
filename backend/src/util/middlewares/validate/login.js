const { sendError } = require('./invalid');

function credentials(req, res, next) {
  const { username, password } = req.body;
  if (!username) return sendError.missingParam(next, 'username');
  if (!password) return sendError.missingParam(next, 'password');
  if (typeof username !== 'string') return sendError.badParam(next, 'username');
  if (typeof password !== 'string') return sendError.badParam(next, 'password');
  next();
}


module.exports = {
  credentials,
};
