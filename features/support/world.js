'use strict';

const { setWorldConstructor } = require('cucumber');
const AwesomeProduct = require('../../lib');

class CustomWorld {

    constructor() {

        this.api = new AwesomeProduct();
    }

    async readyApiForTesting() {

        await this.api.init();
    }

    isApiReady() {

        return (this.api.server) ? true : false;
    }
}

setWorldConstructor(CustomWorld);
