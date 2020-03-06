const competenceController = require('../../../src/controller/competence');
const { User } = require('../../../src/model/Competence');
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
describe('Competence controller', () => {
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

    test('Should get all competences', async (done) => {
        try {
            await transaction.start();
            await transaction.query('INSERT INTO Competence (name) VALUES (\'competence\');');
            await transaction.end();
            const competences = await competenceController.getAll();
            expect(competences.length).toEqual(1);
            expect(competences[0].name);
            done();
        } catch (error) {
            await transaction.rollback();
            done(error);
        }
    });
});


