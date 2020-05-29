# hapi-path

This project is current as of May 2020

---

`hapi-path` is a demonstration of a fairly complete [Hapi.js](https://hapi.dev) rest api project structure.

This is not an attempt at an exhaustively complex project, but one that, as a software project, exhibits 
important things that one might care to have in place.

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
  and acceptance tests, while other technical concerns can be covered with unit testings. The *combined
  coverage* from each test runner produces the final coverage assessment.

  Try it yourself comparing the coverage outputs from:
  - unit tests: `npm run _cover:unit` (the unit testing deliberately ignores the route handler that delivers the business feature) (Note to self: Never try to wrap `nyc` around `lab -c`. Lab's execution of code coverage introduces some process level complexity that degrades the consistentcy and reliability of the nyc coverage assessment. )
  - acceptance tests: `npm run _cover:acceptance` (the acceptance test only concerns itself with the business functionality)
  - combined coverage reporting: `npm run cover` (browse `./coverage/index.html` for an easily reviewable report) (Note that the 'business feature' is implemented on line 5 of [lib/handlers/hello.js](lib/handlers/hello.js). Only the cucumber acceptance testing exercises this code.)

- OpenAPI Documentation via [hapi-swagger](https://github.com/glennjones/hapi-swagger) ( browse at http://localhost:3000/documentation#/ )
- Logging via [pino](https://github.com/pinojs/pino) and [hapi-pino](https://github.com/pinojs/hapi-pino)

Additionally, the project demonstrates a [Dockerfile](./Dockerfile) suitable for production use.

### Quickstart

Assumption:

```json
"engines": {
  "node": ">=12"
}
```

```sh
# grab the project
git clone https://github.com/momiller121/hapi-path.git ; cd hapi-path

# install dependencies
npm i

# exercise the tests and produce the coverage report
npm run cover

# review the coverage report
open ./coverage/index.html

# start the server
npm start

# review the OpenAPI docs
open http://localhost:3000/documentation

```

### Bonus Feature!

VSCode users see [.vscode/launch.json]() for launch scripts to debug either `lab` or `cucumber` tests.