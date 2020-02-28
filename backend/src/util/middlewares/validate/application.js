const {sendError} = require('./invalid');

const DATE_PATTERN = /^(\d\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/;

function form(req, res, next) {
  const { form: formData } = req.body;
  if (!formData) return sendError.missingParam(next, 'form');
  if (!formData.availabilities) return sendError.missingParam(next, 'availabilities');
  if (!formData.competences) return sendError.missingParam(next, 'competences');
  const { availabilities } = formData;
  const { competences } = formData;
  if (!Array.isArray(availabilities)) return sendError.badParam(next, 'availabilities');
  if (!Array.isArray(competences)) return sendError.badParam(next, 'competences');
  for (const availability of availabilities) {
    if (!availability.from || !availability.to) {
      return sendError.badParam(next, 'availability missing date');
    }
    const fromMatch = availability.from.match(DATE_PATTERN);
    const toMatch = availability.to.match(DATE_PATTERN);
    if (!fromMatch || !toMatch) {
      return sendError.badParam(next, 'availability has invalid date formats');
    }
    if (fromMatch[1] > toMatch[1]) {
      return sendError.badParam(next, 'toDate year must be after fromDate year');
    }
    if (fromMatch[1] === toMatch[1]) {
      if (fromMatch[2] > toMatch[2]) {
        return sendError.badParam(next, 'toDate month must be after fromDate month');
      }
      if (fromMatch[2] === toMatch[2]) {
        if (fromMatch[3] > toMatch[3]) {
          return sendError.badParam(next, 'toDate day must be after fromDate day');
        }
        if (fromMatch[3] === toMatch[3]) {
          return sendError.badParam(next, 'toDate day must be atleast one day after fromDate day');
        }
      }
    }
  }
  for (const competence of competences) {
    if (!competence.name) return sendError.missingParam(next, 'competence name');
    if (!competence.years_of_experience) return sendError.missingParam(next, 'competence experience');
    if (competence.name.length < 1) return sendError.badParam(next, 'competence name');
    if (typeof (competence.years_of_experience) !== 'number') return sendError.badParam(next, 'competence experience');
  }
  next();
}


module.exports = {
  form
};
