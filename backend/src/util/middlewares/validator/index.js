
const DATE_PATTERN = /^(\d\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/;

function missingParam(res, message) {
  res.status(400).send(`Missing parameter: ${message}`);
}

function badParam(res, message) {
  res.status(400).send(`Malformed parameter: ${message}`);
}

function validateApplicationForm(req, res, next) {
  const { form } = req.body;
  if (!form) return missingParam(res, 'form');
  if (!form.availabilities) return missingParam(res, 'availabilities');
  if (!form.competences) return missingParam(res, 'competences');
  const { availabilities } = form;
  const { competences } = form;
  if (!Array.isArray(availabilities)) return badParam(res, 'availabilities');
  if (!Array.isArray(competences)) return badParam(res, 'competences');
  for (const availability of availabilities) {
    if (!availability.from || !availability.to) {
      return badParam(res, 'availability missing date');
    }
    const fromMatch = availability.from.match(DATE_PATTERN);
    const toMatch = availability.to.match(DATE_PATTERN);
    if (!fromMatch || !toMatch) {
      return badParam(res, 'availability has invalid date formats');
    }
    if (fromMatch[1] > toMatch[1]) {
      return badParam(res, 'toDate year must be after fromDate year');
    }
    if (fromMatch[1] === toMatch[1]) {
      if (fromMatch[2] > toMatch[2]) {
        return badParam(res, 'toDate month must be after fromDate month');
      }
      if (fromMatch[2] === toMatch[2]) {
        if (fromMatch[3] > toMatch[3]) {
          return badParam(res, 'toDate day must be after fromDate day');
        }
        if (fromMatch[3] === toMatch[3]) {
          return badParam(res, 'toDate day must be atleast one day after fromDate day');
        }
      }
    }
  }
  for (const competence of competences) {
    if (!competence.name) return missingParam(res, 'competence name');
    if (!competence.years_of_experience) return missingParam(res, 'competence experience');
    if (competence.name.length < 1) return badParam(res, 'competence name');
    if (typeof (competence.years_of_experience) !== 'number') return badParam(res, 'competence experience');
  }
  next();
}


const post = {
  application: validateApplicationForm,
};

module.exports = {
  post,
};
