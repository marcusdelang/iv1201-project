const DAO = require('../integration/ApplicationDAO')


class Application {
    constructor(form, user) {
        form.version ? this.version = form.version : this.version = 1
        form.status ? this.status = form.status : this.status = 'unhandled'
        const { user, availabilities, competences} = form
        this.person = user.person_id
        this.availabilities = availabilities
        this.competences = competences

        this.store = async () => {
            await DAO.store(this)
        }
    }
}

async function find(user) {
    return await DAO.find(user.person_id)
}

module.exports = {
    Application,
    find
}