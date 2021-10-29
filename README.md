# hapi-path

This project is current as of October 2021

[![Run on Repl.it](https://repl.it/badge/github/momiller121/hapi-path)](https://repl.it/github/momiller121/hapi-path)

---

`hapi-path` is a demonstration of a decent enterprise / production grade [Hapi.js](https://hapi.dev) REST API server.

This is a REST API that produces either anonymous or personalized greetings. It is barely more
than hello-world.

This is not an attempt to show a complex project, but one that, as a server software project, exhibits important things that one might care to have in place. Also, this had to have some kind of project structure, but it's not meant to be a strong opinion on that front. There are many decent ways to structure a project.

The main point of this is to demonstrate how elegantly the *business value behavior* (in this
case, the ability to respond with a greeting) of a system may be defined and asserted using Gherkin
syntax feature files AND the *associated but very separate* value of unit testing. 

Philosophically, this example values 100% test coverage. But this doesn't mean that pedantic, useless
tests were written to close on that value. It just means that where no coverage existed, the
code was either removed, tested, or ignored from test processing. The point of 100% test coverage
is that everything was *thoughtfully considered*.

It aims to demonstrate:

- Unit testing with [lab](https://hapi.dev/tutorials/testing/?lang=en_US)
  - `npm run test:unit`
- Acceptance testing with [cucumberjs](https://github.com/cucumber/cucumber-js)
  - `npm run test:acceptance`
- Code coverage with `nyc`.

  `nyc` presents a more sophisticated coverage tool than `@hapi/lab`. This project demonstrates
  the ability to use `nyc` to produce coverage reporting via:
  - the `@hapi/lab` unit tests
  - the `cucumber` acceptance tests
  - OR a *combined coverage* of both unit and acceptance testing.

  The aim is to show that the business requirements can be managed through behaviour driven development
  and acceptance tests, while other technical concerns can be covered with unit testing. The *combined
  coverage* from each test runner produces the final coverage assessment.

  You can try it yourself by comparing the coverage outputs from:
  - unit tests: `npm run _cover:unit` (the unit testing deliberately ignores the route handler that delivers the business feature) (Note to self: Never try to wrap `nyc` around `lab -c`. Lab's execution of code coverage introduces some process level complexity that degrades the consistency and reliability of the nyc coverage assessment. )
  - acceptance tests: `npm run _cover:acceptance` (the acceptance test only concerns itself with the business functionality)
  - combined coverage reporting: `npm run cover` (browse `./coverage/index.html` for an easily reviewable report) (Note that the 'business feature' is implemented on line 5 of [lib/handlers/hello.js](lib/handlers/hello.js). Only the cucumber acceptance testing exercises this code.)

- OpenAPI Documentation via [hapi-swagger](https://github.com/glennjones/hapi-swagger) ( browse at http://localhost:3000/documentation#/ )
- Logging via [pino](https://github.com/pinojs/pino) and [hapi-pino](https://github.com/pinojs/hapi-pino)
- [TODO] Prometheus metrics

Additionally, the project demonstrates a [Dockerfile](./docker/Dockerfile) suitable for production use.

```sh
docker build -f docker/Dockerfile .
```

## Quickstart

Assumption:

```json
"engines": {
  "node": ">=14"
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

### VSCode Debug Launch Configuration

VSCode users see [.vscode/launch.json](.vscode/launch.json) for launch scripts to debug either `lab` or `cucumber` tests.
