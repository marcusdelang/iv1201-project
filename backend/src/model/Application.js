const DAO = require('../integration/ApplicationDAO')


class Application {
    constructor(form, user) {
        form.version ? this.version = form.version : this.version = 1
        form.status ? this.status = form.status : this.status = 'unhandled'
        const {availabilities, competences} = form
        this.person = user.person_id
        this.availabilities = availabilities
        this.competences = competences

        this.store = async () => {
            await DAO.store(this)
        }
    }
}

async function exist(personId){
    return DAO.exist(personId)
}

async function find(person) {
    return await DAO.find(personId)
}

module.exports = {
    Application,
    exist,
    find
}