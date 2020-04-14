# hapi-path

This project is current as of April 2020

---

`hapi-path` is a demonstration of a fairly complete [Hapi.js](https://hapi.dev) rest api project structure.

It aims to demonstrate:
- Unit testing with [lab](https://hapi.dev/tutorials/testing/?lang=en_US)
  - `npm run test:unit`
- Acceptance testing with [cucumberjs](https://github.com/cucumber/cucumber-js)
  - `npm run test:acceptance`
- Code coverage with `nyc`.

  `nyc` presents a more sophiticated coverage tool than `@hapi/lab`. This project demonstrates
  the ability to use `nyc` to produce coverage reporting via:
  - the `@hapi/lab` unit tests
  - the `cucumber` acceptance tests
  - OR a *combined coverage* of both unit and acceptance testing.

  The aim is to show that the business requirements can be managed through behaviour driven development
  and acceptance tests, while other technical concerns can be covered with unit testings.

  Try it yourself comparing the coverage outputs from:
  - unit tests: `npm run _cover:unit` (the unit testing deliberately ignores the route handler that delivers the business feature)
  - acceptance tests: `npm run _cover:acceptance` (the acceptance test only concerns itself with the business functionality)
  - combined coverage reporting: `npm run cover:all` (browse `./coverage/index.html` for an easily reviewable report)

- OpenAPI Documentation via [hapi-swagger](https://github.com/glennjones/hapi-swagger) ( browse at http://localhost:3000/documentation#/ )
- Logging via [pino](https://github.com/pinojs/pino) and [hapi-pino](https://github.com/pinojs/hapi-pino)

Additionally, the project demonstrates a [Dockerfile](./Dockerfile) suitable for production use.