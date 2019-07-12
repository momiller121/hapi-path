'use strict';

const Server = require('./lib/server');

Server.start().catch((err) => {

    console.error('server failed to start');
    console.error(err);
    process.exit(1);
});
