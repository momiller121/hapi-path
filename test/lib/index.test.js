'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = Lab.script();

const AwesomeProduct = require('../../lib');

describe('AwesomeProduct', () => {

    it('exports a class', () => {

        expect(AwesomeProduct).to.be.a.function();
        expect(new AwesomeProduct()).to.be.an.object();
    });

    it('can be initialized with defaults', async () => {

        const testInstance  = new AwesomeProduct();
        await testInstance.init();
        expect(testInstance.server).to.exist();
    });

    it('can be initialized with override configuration values', async () => {

        const customHostValue = '127.0.0.1';
        const testInstance  = new AwesomeProduct();
        await testInstance.init({ host: customHostValue });
        expect(testInstance.server.info.host).to.equal(customHostValue);
    });

    it('can be started directly with override configuration values', async () => {

        const customHostValue = '127.0.0.1';
        const testInstance  = new AwesomeProduct();
        await testInstance.start({ host: customHostValue });
        expect(testInstance.server.info.host).to.equal(customHostValue);
        await testInstance.server.stop({ timeout: 0 });
    });

    it('protects itself from multiple initializations', async () => {

        const testInstance  = new AwesomeProduct();
        await testInstance.init();
        await testInstance.init();
    });

    it('protects itself from multiple starts', async () => {

        const testInstance  = new AwesomeProduct();
        await testInstance.start();
        await testInstance.start();
        await testInstance.server.stop({ timeout: 0 });
    });

    it('rejects initialization on invalid configuration', async () => {

        const customHostValue = 1234567; // an invalid integer where a hostname string is required
        const testInstance  = new AwesomeProduct();
        await expect(testInstance.init({ host: customHostValue })).to.reject(/"host" must be a string/);
    });

    it('can be started directly with defaults', async () => {

        const testInstance  = new AwesomeProduct();
        await testInstance.start();
        expect(testInstance.server).to.exist();
        expect(testInstance.server.info.started <= Date.now()).to.be.true(); // started a moment ago
        await testInstance.server.stop({ timeout: 0 });
    });

    it('can be started after being initialized with override configuration values', async () => {

        const customHostValue = '127.0.0.1';
        const testInstance  = new AwesomeProduct();
        await testInstance.init({ host: customHostValue });
        await testInstance.start();
        expect(testInstance.server.info.host).to.equal(customHostValue);
        expect(testInstance.server.info.started <= Date.now()).to.be.true(); // started a moment ago
        testInstance.server.stop({ timeout: 0 });
    });

    it('can be stopped', async () => {

        const testInstance  = new AwesomeProduct();
        await testInstance.init();
        await testInstance.start();
        expect(testInstance.server.info.started).to.be.greaterThan(0);
        await testInstance.stop();
        expect(testInstance.server.info.started).to.equal(0);
    });
});
