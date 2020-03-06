const UserDAO = require('../../../src/integration/UserDAO');
const { User } = require('../../../src/model/User');
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

describe('User integration', () => {
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

    test('Should create a new user without errors', async (done) => {
        const details = {
            name: 'unittest',
            surname: 'unittest',
            ssn: '1111111111',
            email: 'unit@test.com',
            username: 'unittest',
            password: 'unittest'
        }
        const user = new User(details);
        try {
            await UserDAO.store(user);
            done();
        } catch (error) {
            done(error);
        }
    });

    test('Should find a user in the database', async (done) => {
        try {
            const foundUser = await UserDAO.find('unittest');
            expect(foundUser.name).toEqual('unittest');
            done();
        } catch (error) {
            done(error);
        }
    });
});
