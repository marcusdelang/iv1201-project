const { User } = require('../../../src/model/User');
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
describe('User model', () => {
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

    test('Should create a valid instance of User class', async (done) => {
        try {
            const details = {
                name: 'name',
                surname: 'surname',
                ssn: '1111111111',
                email: 'email@email.com',
                username: 'username',
                password: 'password'
            }
            const newUser = new User(details);
            expect(newUser.name).toEqual('name');
            expect(newUser.surname).toEqual('surname');
            expect(newUser.ssn).toEqual('1111111111');
            expect(newUser.email).toEqual('email@email.com');
            expect(newUser.username).toEqual('username');
            expect(newUser.password).toEqual('password');
            done();
        } catch (error) {
            done(error);
        }
    });
});


