'use strict';

/**
 * airport service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::airport.airport');
