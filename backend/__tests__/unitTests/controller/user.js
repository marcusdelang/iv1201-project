const userController = require('../../../src/controller/user');
const { User } = require('../../../src/model/user');
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
            await endConnection();
            return done();
        } catch (error) {
            return done(error);
        }
    });

    test('Should create a new user', async (done) => {
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
            await userController.createNewUser(newUser);
            await transaction.start();
            const res = await transaction.query('SELECT * FROM Person;');
            await transaction.end();
            const person = res.rows[0];
            expect(person.name).toEqual('name');
            expect(person.surname).toEqual('surname');
            done();
        } catch (error) {
            await transaction.rollback();
            done(error);
        }
    });
});


