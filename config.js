'use strict';

const { promisify } = require('util');
const Fs = require('fs');
const Joi = require('@hapi/joi');
const readFileAsync = promisify(Fs.readFile);

const internals = {
    // Here we represent a mapping of k8s namespace values to the appropriate DNS hostnames.
    // This allows us to dynamically provide the host value to the hapi-swagger configuration.
    // ( see the ENV_K8S_NAMESPACE variable definition in the api-deployment.yml )
    namespaceHostMap: {
        sandbox: 'sandbox-api.westjet.com',
        dev: 'dev-api.westjet.com',
        development: 'dev-api.westjet.com',
        staging: 'stg-api.westjet.com',
        production: 'api.westjet.com'
    }
};

module.exports = {
    /**
     * Function to retreive the configuration settings for the project.
     * This is built as an async example although, because this is generally a
     * one time operatation at process start, it could also be synchronous.
     * @param { String } - k8s_namespace - string value of the Kubernetes namespace used to lookup the appropriate DNS mapping value.
     * @async
     */
    init: async (k8s_namespace) => {

        let creds;
        try {
            // This is only an illustration. Perhaps these secrets come from a k8s secret volume mount...
            const rawFile = await readFileAsync('/keyvault/creds.json');
            /* $lab:coverage:off$ */
            creds = JSON.parse(rawFile.toString());
            /* $lab:coverage:on$ */
        }
        catch (error) {
            // provide default values suitable for test support only
            // ( these are not real credential values )
            creds = { username: 'foo', password: 'bar' };
        }

        return {
            schema: Joi.object({
                host: Joi.string().hostname().required(),
                port: Joi.number().integer().min(80).max(65535).required(),
                swaggerHost: Joi.string().hostname().optional(),
                loggingLevel: Joi.string().allow('trace','debug', 'info', 'warn', 'error', 'fatal', 'silent').required(),
                creds: Joi.object({
                    username: Joi.string().required(),
                    password: Joi.string().required()
                })
            }),
            settings: {
                host: '0.0.0.0',
                port: 3000,
                swaggerHost: internals.namespaceHostMap[k8s_namespace],
                loggingLevel: process.env.ENV_LOGGING_LEVEL || 'error',
                creds
            }
        };
    }
};
