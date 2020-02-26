
class StoreUserError extends Error {
    constructor(error) {
        super(error.message);
        if (this.message.includes('duplicate')) {
            this.status = 409;
            this.cause = 'duplicate';
            if (this.message.includes('person_username_key')) {
                this.field = 'username';
            } else if (this.message.includes('person_ssn_key')) {
                this.field = 'ssn';
            } else if (this.message.includes('person_email_key')) {
                this.field = 'email';
            }
        } else {
            this.status = 500;
            this.cause = 'server';
        }
    }
}

class StoreApplicationError extends Error {
    constructor(error) {
        super(error.message);
        if (this.message.includes('already exists')) {
            this.status = 409;
            this.cause = 'duplicate';
        } else {
            this.status = 500;
            this.cause = 'server';
        }
    }
}

class AuthError extends Error {
    constructor(error) {
        super(error.message);
        if (this.message.includes('invalid')) {
            this.status = 401;
            this.cause = 'invalid';
            this.field = 'credentials'
        } else if (this.message.includes('no user')) {
            this.status = 401;
            this.cause = 'no user';
        } else {
            this.status = 500;
            this.cause = 'server';
        }
    }
}

class FindUserError extends Error {
    constructor(error) {
        super(error.message);
        if (this.message.includes('no user')) {
            this.status = 404;
            this.cause = 'no user';
        } else {
            this.status = 500;
            this.cause = 'server';
        }
    }
}

module.exports = {
    StoreUserError,
    StoreApplicationError,
    AuthError,
    FindUserError
}