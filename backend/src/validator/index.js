
function missingParam(res, message, next){
    res.status(400).send('Missing parameter:', message);
}

  const post = {
      application : (req, res, next) =>{
        const { form } = req.body;
        if(!form) return missingParam(res, 'form');
        if(!form.availabilities) return missingParam(res, 'availabilities');
        if(!form.competences) return missingParam(res, 'competences')
        next();
      }
  }

  module.exports = {
      post
  }