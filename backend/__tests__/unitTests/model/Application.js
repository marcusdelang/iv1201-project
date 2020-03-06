const { Application } = require('../../../src/model/Application');
const transaction = new (require('../../../src/integration/dbh').Transaction);
const endConnection = require('../../../src/integration/dbh').endConnection;

async function clearDB(transaction) {
    return Promise.all([
        transaction.query('DELETE FROM Competence_profile *'),
        transaction.query('DELETE FROM Competence *'),
        transaction.query('DELETE FROM Application *'),
        transaction.query('DELETE FROM Availability *'),
        transaction.query('DELETE FROM Person *'),
    ]);
}
describe('Application model', () => {
    beforeAll(async (done) => {
        try {
            await transaction.start();
            await clearDB(transaction);
            await transaction.end();
            return done();
        } catch (error) {
            await transaction.rollback();
            return done(error);
        }
    });

    afterAll(async (done) => {
        try {
            endConnection();
            return done();
        } catch (error) {
            return done(error);
        }
    });

    test('Should create a valid instance of Application class', async (done) => {
        try {
            const form = {
                availabilities: [],
                competences: [],
            };
            const user = {
                person_id: 1,
                name: 'name',
                surname: 'surname',
                ssn: '1111111111',
                email: 'email@email.se'
            };
            const newApplication = new Application(form, user);
            expect(newApplication.availabilities.length).toEqual(0);
            expect(newApplication.competences.length).toEqual(0);
            expect(newApplication.person.id).toEqual(1);
            expect(newApplication.person.name).toEqual('name');
            expect(newApplication.person.surname).toEqual('surname');
            expect(newApplication.person.ssn).toEqual('1111111111');
            expect(newApplication.person.email).toEqual('email@email.se');
            done();
        } catch (error) {
            done(error);
        }
    });
});

