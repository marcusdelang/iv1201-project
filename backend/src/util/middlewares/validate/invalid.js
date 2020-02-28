function missingParam(next, message) {
    next({ code: 400, message: `Missing parameter: ${message}` });
}

function badParam(next, message) {
    next({ code: 400, message: `Malformed parameter: ${message}` });
}


module.exports = {
    sendError: {
        missingParam,
        badParam
    }
}