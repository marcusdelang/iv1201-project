const authUtil = require('../../../src/util/authUtil');

describe('Auth Util', () => {
    test('Should sign credentials', async (done) => {
        try {
            const hash =  await authUtil.sign({username: 'username', password: 'password'});
            expect(typeof(hash)).toEqual('string');
            done();
        } catch (error) {
            done(error);
        }
    });

    test('Should verify credentials', async (done) => {
        try {
            const hash =  await authUtil.sign({username: 'username', password: 'password'});
            expect(typeof (hash)).toEqual('string');
            const verify = await authUtil.verify(hash);
            expect(verify.username).toEqual('username');
            expect(verify.password).toEqual('password');
            done();
        } catch (error) {
            done(error);
        }
    });
});


