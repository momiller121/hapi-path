'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = Lab.script();

const Config = require('../config.js');

describe('Config', () => {

    it('should be able to map API UI DNS name based on K8S namespace value', async () => {

        let config = await Config.init('sandbox');
        expect(config.settings.swaggerHost).to.be.equal('sandbox-api.westjet.com');

        config = await Config.init('dev');
        expect(config.settings.swaggerHost).to.be.equal('dev-api.westjet.com');

        config = await Config.init('development');
        expect(config.settings.swaggerHost).to.be.equal('dev-api.westjet.com');

        config = await Config.init('staging');
        expect(config.settings.swaggerHost).to.be.equal('stg-api.westjet.com');

        config = await Config.init('production');
        expect(config.settings.swaggerHost).to.be.equal('api.westjet.com');
    });

    it('can set the logging level from the process environment', async () => {

        process.env.ENV_LOGGING_LEVEL = 'debug';
        const config = await Config.init('sandbox');
        expect(config.settings.loggingLevel).to.equal('debug');
    });
});
