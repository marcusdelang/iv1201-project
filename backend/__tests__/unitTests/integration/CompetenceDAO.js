const CompetenceDAO = require('../../../src/integration/CompetenceDAO');
const { Transaction, endConnection } = require('../../../src/integration/dbh');
const transaction = new Transaction();

async function clearDB(transaction) {
    return Promise.all([
        transaction.query('DELETE FROM Competence_profile *'),
        transaction.query('DELETE FROM Competence *'),
        transaction.query('DELETE FROM Application *'),
        transaction.query('DELETE FROM Availability *'),
        transaction.query('DELETE FROM Person *'),
    ]);
}
describe('Competence integration', () => {
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

    test('Should find a competence in the database', async (done) => {
        try {
            await transaction.start();
            await transaction.query('INSERT INTO Competence (name) VALUES (\'unittest\');');
            await transaction.end();
            const foundCompetences = await CompetenceDAO.findAll();
            expect(foundCompetences.length).toEqual(1);
            expect(foundCompetences[0]).toEqual('unittest');
            done();
        } catch (error) {
            done(error);
        }
    });
});


