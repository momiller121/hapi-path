'use strict';

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@hapi/code');

Given('the API is ready and operational', async function () {

    await this.readyApiForTesting();
    expect(this.isApiReady()).to.be.true();
});

When('I request the main resource without providing my name', async function () {

    const result = await this.api.server.inject('/');
    this.lastResult = result;
    expect(this.lastResult).to.exist();
});

Then('I receive an anonymous greeting', function () {

    expect(this.lastResult.statusCode).to.equal(200);
    expect(this.lastResult.payload).to.equal('Hello World!');
});

// review Cucumber expressions: https://cucumber.io/docs/cucumber/cucumber-expressions/
When('I request the main resource and provide my name as {word}', async function (name) {

    const result = await this.api.server.inject(`/?name=${name}`);
    this.lastResult = result;
    expect(this.lastResult).to.exist();
});

// review Cucumber expressions: https://cucumber.io/docs/cucumber/cucumber-expressions/
Then('I receive an customized greeting which includes my name as {word}', function (name) {

    expect(this.lastResult.statusCode).to.equal(200);
    expect(this.lastResult.payload).to.equal(`Hello ${name}`);
});

