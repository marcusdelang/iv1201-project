# Recruitment Application - Project in IV1201, Arkitektur och design av globala applikationer at KTH EECS

[![Build Status](https://travis-ci.org/MarcusNilssonGithub/iv1201-project.svg?branch=master)](https://travis-ci.org/MarcusNilssonGithub/iv1201-project)

A simple recruitment website built with Node.js for an unspecified amusement park as part of the course IV1201 at KTH.

The in-production website is hosted on Heroku and is live on https://iv1201-project.herokuapp.com

## Requirements

- Website code is written in [Node.js](https://nodejs.org/), which is required to run the website. (Mandatory)
- [Docker and Docker-compose](https://www.docker.com/) are used to host a development environment locally. (Mandatory)
- The database migration program is written in [Go](https://golang.org/). (Optional)

## Install dependencies

From project root:

```bash
npm install --prefix frontend backend   # install dependencies in frontend and backend
```

## Run development environment

The development environment uses Docker-compose to provide a fully functional site which is reachable on http://localhost/.

From project root:

```bash
docker-compose up --build    # start development server
```

## Run tests against the development environment

Must be run in a separate terminal when the Docker environment is fully up and running.

```bash
docker exec -it app npm run test-docker --prefix backend    # Run tests in development env
```

## Map structure
<Project Root>
│
├── backend
│   ├── docs
│   │   ├── fonts
│   │   ├── scripts
│   │   │   └── prettify
│   │   └── styles
│   ├── logs
│   ├── src
│   │   ├── bin
│   │   ├── config
│   │   │   └── logs
│   │   ├── controller
│   │   ├── integration
│   │   ├── logs
│   │   ├── middlewares
│   │   │   └── validator
│   │   ├── model
│   │   ├── routes
│   │   └── views
│   └── __tests__
├── database
├── frontend
│   ├── public
│   └── src
│       ├── component
│       │   └── component
│       └── resources
│           └── styles
└── node_modules
## Code overview

## Run database migration

The database migration solution relies on being provided with environment variables in order to connect to the old database. Placeholders are available in the file `database/example_migration_env` but for clear reasons need to be changed in order to work live.  
Output is written to the file `database/database_dump.sql`, which is overwritten every time the program is run.  
It is up to the end user to ensure that this does not become an issue.

```bash
source database/example_migration_env    # Set connection credentials as environment variables
go run database/dbmigration.go           # Run migration program
```

This can then be loaded into a Heroku-hosted Postgres database by running the following when logged into Heroku in a terminal.

```bash
heroku pg:psql --app name-of-your-application-on-heroku < database/database_dump.sql
```

## Database model

![](database/database_model.png)
