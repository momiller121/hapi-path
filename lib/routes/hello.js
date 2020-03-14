'use strict';

const Path = require('path');
const Joi = require('@hapi/joi');
const Package = require('../../package');

const helloRoute = {
    name: `${Package.name}_route_hello`,
    version: Package.version,
    register: async function (server, options) {

        await server.route({
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
                handler: require(Path.join(__dirname, '..', 'handlers', Path.basename(__filename)))
            }
        });
    }
};

module.exports = helloRoute;
