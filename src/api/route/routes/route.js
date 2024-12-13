'use strict';

/**
 * route router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::route.route');

module.exports = createCoreRouter('api::route.route', {
    config: {
      find: {
        middlewares: ["api::route.routes-filters"],
      }
    },
  });
