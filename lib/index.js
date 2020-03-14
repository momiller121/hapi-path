'use strict';

const Path = require('path');
const Pack = require(Path.join(__dirname, '..', 'package'));
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Hoek = require('@hapi/hoek');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HapiPino = require('hapi-pino');

const Config = require('../config');

const internals = {
    defaults: {
        host: '0.0.0.0',
        port: 3000,
        loggingLevel: 'error'
    },
    registerPlugins: async (instance) => {

        await instance.server.register([{
            plugin: HapiPino,
            options: {
                level: instance.config.loggingLevel,
                prettyPrint: process.env.NODE_ENV !== 'production',
                // Redact Authorization headers, see https://getpino.io/#/docs/redaction
                redact: ['req.headers.authorization']
            }
        },
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: instance.swaggerOptions
        }
        ]);

        // set the flag that plugin registration is complete
        instance.pluginsRegistered = true;
    }
};

/**
 * Class representing the top level product constructor
 * @class
 */
const AwesomeProduct = class {

    /**
     * @constructor
     */
    constructor() {

        this.pluginsRegistered = false;

        this.swaggerOptions = {
            info: {
                title: 'Awesome API Documentation',
                version: Pack.version
            }
        };
    }

    /**
     * Initialize the application http server (but do not open the socket listener)
     * ( Although this can be used independently, it is most useful for testing support. )
     * @async
     * @params { object } - see ../config.js for settings schema info
     */
    async init(options = {}) {

        // If the instance has been previously initialized, return without change.
        if (this.pluginsRegistered) {
            return this;
        }

        const systemConfig = await Config.init();
        const userConfig = Hoek.applyToDefaults(internals.defaults, options);
        const config = Hoek.applyToDefaults(systemConfig.settings, userConfig);
        const validation = systemConfig.schema.validate(config);
        if (validation.error) {
            throw new Error(validation.error.details[0].message);
        }
        this.config = config;

        this.server = Hapi.server({
            port: this.config.port,
            host: this.config.host
        });

        this.server.route({
            method: 'GET',
            path: '/',
            options: {
                description: 'Say hello',
                notes: 'offers a personalized greeting',
                tags: ['api'], // ADD THIS TAG
                validate: {
                    query: Joi.object({
                        name: Joi.string()
                            .optional()
                            .description('greeting name')
                    })
                },
                handler: function (request, h) {

                    return request.query.name ? `Hello ${request.query.name}` : 'Hello World!';
                }
            }
        });
        await internals.registerPlugins(this);
        await this.server.initialize(); // see the hapi server api & https://hapi.dev/tutorials/testing/?lang=en_US
        return this;
    }

    /**
     * Start the application http server
     */
    async start() {

        if (this.server && this.server.info.started > 0) { // already running
            return this;
        }
        else if (!this.pluginsRegistered) { // not even initialized
            await this.init();
            await this.server.start();
        }
        else { // initialized but not yet started
            await this.server.start();
        }
        return this;
    }

    /**
     * Stop the application http server
     */
    async stop() {

        await this.server.stop({ timeout: 3000 });
    }
};

module.exports = AwesomeProduct;
