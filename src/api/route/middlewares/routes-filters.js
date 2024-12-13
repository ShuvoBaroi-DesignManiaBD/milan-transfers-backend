"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { fromAirport, fromCity } = ctx.query;

    if (!fromAirport && !fromCity) {
      // If no filtering query, skip middleware
      return next();
    }

    // Fetch all routes with populated relations
    const routes = await strapi.entityService.findMany('api::route.route', {
      populate: ["pickup", "pickup.airport", "pickup.city", "dropoff","dropoff.airport", "dropoff.city"],
    });

    // Filter the results programmatically
    const filteredRoutes = routes.filter(route => {
      const pickupItems = route.pickup || [];
      return pickupItems.some(item => {
        if (fromAirport && item.__component === 'route.location' && item.airport) {
          return item.airport.Name.toLowerCase() === fromAirport.toLowerCase();
        }
        if (fromCity && item.__component === 'route.destination' && item.City) {
          return item.City.toLowerCase() === fromCity.toLowerCase();
        }
        return false;
      });
    });

    // Attach filtered results to the context
    ctx.body =  filteredRoutes;

    // Proceed to the next middleware
    await next();
  };
};
