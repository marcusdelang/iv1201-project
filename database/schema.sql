CREATE TABLE Role (
    role_id SERIAL PRIMARY KEY, name VARCHAR(255)
);

CREATE TABLE Person (
    person_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    ssn VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INTEGER REFERENCES Role NOT NULL,
    username VARCHAR(255) NOT NULL,
    UNIQUE (username),
    UNIQUE (ssn),
    UNIQUE (email)
);

CREATE TABLE Availability (
    availability_id SERIAL PRIMARY KEY,
    person INTEGER REFERENCES person,
    from_date DATE,
    to_date DATE
);

CREATE TABLE Competence (
    competence_id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Competence_profile (
    competence_profile_id SERIAL PRIMARY KEY,
    person INTEGER REFERENCES person,
    competence INTEGER REFERENCES competence,
    years_of_experience NUMERIC(4, 2)
);


CREATE TABLE Status (
    name VARCHAR(255) PRIMARY KEY
);

CREATE TABLE Application (
    version INTEGER,
    person INTEGER REFERENCES person PRIMARY KEY,
    status VARCHAR(255) REFERENCES status
);

INSERT INTO Status (name) VALUES ('unhandled');
INSERT INTO Status (name) VALUES ('accepted');
INSERT INTO Status (name) VALUES ('rejected');

INSERT INTO Role (name) VALUES ('recruiter');
INSERT INTO Role (name) VALUES ('applicant');

INSERT INTO Person (name, surname, ssn, email, password, role, username) VALUES ('applicant', 'applicant', '12345678-4321', 'applicant@applicant.se', 'applicant', 2, 'applicant');
INSERT INTO Person (name, surname, ssn, email, password, role, username) VALUES ('recruiter', 'recruiter', '12345678-1234', 'recruiter@recruiter.se', 'recruiter', 1, 'recruiter');

INSERT INTO Competence (name) VALUES ('kassör');
INSERT INTO Competence (name) VALUES ('bergochdalbanemekaniker');
INSERT INTO Competence (name) VALUES ('dräktbärare');

