'use strict';

const Path = require('path');
const Pack = require(Path.join(__dirname, '..', 'package'));
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pino = require('pino');
const HapiPino = require('hapi-pino');

const logger = Pino({ level: process.env.PINO_LOG_LEVEL || 'info' }); // one of: 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'.

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    options: {
        description: 'Say hello',
        notes: 'offers a personalized greeting',
        tags: ['api'], // ADD THIS TAG
        validate: {
            query: {
                name : Joi.string()
                    .optional()
                    .description('greeting name')
            }
        },
        handler: function (request, h) {

            return request.query.name ? `Hello ${request.query.name}` : 'Hello World!';
        }
    }
});

const swaggerOptions = {
    info: {
        title: 'Test API Documentation',
        version: Pack.version
    }
};

const registerPlugins = async () => {

    await server.register([{
        plugin: HapiPino,
        options: {
            prettyPrint: process.env.NODE_ENV !== 'production',
            // Redact Authorization headers, see https://getpino.io/#/docs/redaction
            redact: ['req.headers.authorization']
        }
    },
    Inert,
    Vision,
    {
        plugin: HapiSwagger,
        options: swaggerOptions
    }
    ]);
};

exports.init = async () => {

    await registerPlugins();
    await server.initialize();
    return server;
};

exports.start = async () => {

    await registerPlugins();
    await server.start();
    return server;
};

exports.stop = () => {

    server.stop({ timeout: 10000 }).then((err) => {

        if (err){
            logger.fatal(err, 'error during server stop');
        }
        else {
            logger.info('server stop');
        }

        setTimeout(() => {

            process.exit((err) ? 1 : 0);
        }, 750);

    });
};

process.on('unhandledRejection', (err) => {

    logger.fatal(err, 'unhandledRejection');
    setTimeout(() => {

        process.exit(1);
    }, 750);
});

process.on('uncaughtException', (err) => {

    logger.fatal(err, 'uncaughtException');
    setTimeout(() => {

        process.exit(1);
    }, 750);
});
