const { Competence } = require('../../../src/model/Competence');
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
describe('Competence model', () => {
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
            await endConnection();
            return done();
        } catch (error) {
            return done(error);
        }
    });

    test('Should create a valid instance of Competence class', async (done) => {
        try {
            const newCompetence = new Competence('competence name');
            expect(newCompetence.name).toEqual('competence name');
            done();
        } catch (error) {
            done(error);
        }
    });
});


