
const DATE_PATTERN = /^(\d\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/;

function missingParam(next, message) {
  next({ code: 400, message: `Missing parameter: ${message}` });
}

function badParam(next, message) {
  next({ code: 400, message: `Malformed parameter: ${message}` });
}

function validateApplicationForm(req, res, next) {
  const { form } = req.body;
  if (!form) return missingParam(next, 'form');
  if (!form.availabilities) return missingParam(next, 'availabilities');
  if (!form.competences) return missingParam(next, 'competences');
  const { availabilities } = form;
  const { competences } = form;
  if (!Array.isArray(availabilities)) return badParam(next, 'availabilities');
  if (!Array.isArray(competences)) return badParam(next, 'competences');
  for (const availability of availabilities) {
    if (!availability.from || !availability.to) {
      return badParam(next, 'availability missing date');
    }
    const fromMatch = availability.from.match(DATE_PATTERN);
    const toMatch = availability.to.match(DATE_PATTERN);
    if (!fromMatch || !toMatch) {
      return badParam(next, 'availability has invalid date formats');
    }
    if (fromMatch[1] > toMatch[1]) {
      return badParam(next, 'toDate year must be after fromDate year');
    }
    if (fromMatch[1] === toMatch[1]) {
      if (fromMatch[2] > toMatch[2]) {
        return badParam(next, 'toDate month must be after fromDate month');
      }
      if (fromMatch[2] === toMatch[2]) {
        if (fromMatch[3] > toMatch[3]) {
          return badParam(next, 'toDate day must be after fromDate day');
        }
        if (fromMatch[3] === toMatch[3]) {
          return badParam(next, 'toDate day must be atleast one day after fromDate day');
        }
      }
    }
  }
  for (const competence of competences) {
    if (!competence.name) return missingParam(next, 'competence name');
    if (!competence.years_of_experience) return missingParam(next, 'competence experience');
    if (competence.name.length < 1) return badParam(next, 'competence name');
    if (typeof (competence.years_of_experience) !== 'number') return badParam(next, 'competence experience');
  }
  next();
}


const post = {
  application: validateApplicationForm,
};

module.exports = {
  post,
};
