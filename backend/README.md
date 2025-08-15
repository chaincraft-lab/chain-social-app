## Description

Haber Sitesi Backend API - NestJS tabanlı haber yönetim sistemi

## Installation and running the app with docker

```bash
# build
$ docker compose build

# run
$ docker compose up -d
```

## Migrations

```bash
# build
$ docker exec -ti haber-sitesi-backend sh

# create schema
$ npx prisma generate

# run
$ npx prisma migrate dev --name init
```

## Running the app without docker

```bash
# installation
$ yarn install (node > 18.13)

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Documentation

Swagger: http://localhost:3000/api

## Stay in touch

- Authors:
	- Özkan Semiz
- Website - https://github.com/ozknsmz

## License

Nest is [MIT licensed](LICENSE).
