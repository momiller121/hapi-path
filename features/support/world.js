'use strict';

const { setWorldConstructor } = require('cucumber');

class CustomWorld {

    constructor() {


    }
}

setWorldConstructor(CustomWorld);
