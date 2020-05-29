'use strict';

const Pino = require('pino');
const Package = require('./package');
const AwesomeProduct = require('./lib');

const bootstrapLogger = Pino({ level: 'info' }).child({ package: Package.name });

const instance = new AwesomeProduct();

const bootstrap = async () => {

    try {
        await instance.start();
        bootstrapLogger.info(instance.server.info, 'INFO_INSTANCE_START');
    }
    catch (err) {

        bootstrapLogger.fatal(err, 'FATAL_INSTANCE_START');
        setTimeout(() => {

            process.exit(1);
        }, 500);
    }
};

process.on('unhandledRejection', (err) => {

    bootstrapLogger.fatal(err, 'FATAL_unhandledRejection');
    setTimeout(() => {

        process.exit(1);
    }, 500);
});

process.on('uncaughtException', (err) => {

    bootstrapLogger.fatal(err, 'FATAL_uncaughtException');
    setTimeout(() => {

        process.exit(1);
    }, 500);
});

// Docker stop sends SIGTERM
process.on('SIGTERM', async () => {

    bootstrapLogger.info('Got SIGTERM (Probably docker stop). Shutdown in 2 seconds');
    await instance.stop();

    setTimeout(() => {

        process.exit(0);
    },2000);
});

// ctrl-c sends SIGINT
process.on('SIGINT', async () => {

    bootstrapLogger.info('Got SIGINT. Shutdown in 2 seconds');
    await instance.stop();

    setTimeout(() => {

        process.exit(0);
    },2000);
});

bootstrap();
