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
                version: Pack.version,
                description: `## OpenAPI Supports Markdown - so you can make nice documentation

---

This makes it easy to communicate any contextual frame to support developers using the API.

It is also possible to highlight a \`parameter\`. 

    ( or even a whole code block indicated via indentation )

This all looks a little odd in the source code because the formatting of the text drives the markdown rendering.
                `
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
        if (this.server) {
            return this;
        }

        const systemConfig = await Config.init();

        // This is a layered approach to the initial configuration. Interpret as follows:
        //
        // ( 1 ) The code level defaults are used to backfill missing values from the user defined options.
        const userConfig = Hoek.applyToDefaults(internals.defaults, options);

        // ( 2 ) The system config (from the environment or with loaded secrets) is used to backfill values into the user defined options.
        // The result is that the user provided configuration can override everything which is useful for testing.
        // But it also means that everything required can be picked up from the system under normal bootstrap startup.
        const config = Hoek.applyToDefaults(systemConfig.settings, userConfig);

        // The configuration, once loaded, is schema validated. The schema comes from the source of truth in one place, ../config.js.
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
                tags: ['api'], // ADD THIS TAG to include the route in the OpenAPI documentation
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
     * @async
     * @params { object } - see ../config.js for settings schema info
     */
    async start(options = {}) {

        if (this.server && this.server.info.started > 0) { // already running
            return this;
        }
        else if (!this.server) { // not even initialized
            await this.init(options);
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
        return this;
    }
};

module.exports = AwesomeProduct;
