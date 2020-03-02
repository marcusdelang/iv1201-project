const { sendError } = require('./invalid');

function details(req, res, next) {
    const {
        name, surname, ssn, username, password, email,
    } = req.body.user;
    if (!name) return sendError.missingParam(next, 'name');
    if (!surname) return sendError.missingParam(next, 'surname');
    if (!ssn) return sendError.missingParam(next, 'ssn');
    if (!username) return sendError.missingParam(next, 'username');
    if (!password) return sendError.missingParam(next, 'password');
    if (!email) return sendError.missingParam(next, 'email');
    next();
}


module.exports = {
    details,
};