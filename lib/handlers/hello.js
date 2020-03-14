'use strict';

module.exports = (request, h) => {

    return request.query.name ? `Hello ${request.query.name}` : 'Hello World!';
};
