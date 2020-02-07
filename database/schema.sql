CREATE TABLE Role (role_id SERIAL PRIMARY KEY, name VARCHAR(255));

CREATE TABLE Person (
    person_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    ssn VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES Role NOT NULL,
    username VARCHAR(255) NOT NULL,
    UNIQUE (username),
    UNIQUE (ssn),
    UNIQUE (email)
);

CREATE TABLE Availability (
    availability_id SERIAL PRIMARY KEY,
    person_id INTEGER REFERENCES person,
    from_date DATE,
    to_date DATE
);

CREATE TABLE Competence (
    competence_id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Competence_profile (
    competence_profile_id SERIAL PRIMARY KEY,
    person_id INTEGER REFERENCES person,
    competence_id INTEGER REFERENCES competence,
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
