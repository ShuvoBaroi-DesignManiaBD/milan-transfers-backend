"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { fromAirport, fromCity, dropoff } = ctx.query;

    if (!fromAirport && !fromCity) {
      // If no filtering query, skip middleware
      return next();
    }

    // Fetch all routes with populated relations
    const routes = await strapi.entityService.findMany('api::route.route', {
      populate: ["pickup", "pickup.airport", "pickup.city", "dropoff", "dropoff.airport", "dropoff.city", "vehicles", "vehicles.vehicle_type.Thumbnail"],
    });
    
    
    // Filter the results programmatically
    const filteredRoutes = routes.filter(route => {
      const pickupItems = route.pickup || [];
      const dropoffItems = route.dropoff || [];
      
      // Filter pickup items
      const hasMatchingPickup = pickupItems.some(item => {
        if (fromAirport && item.__component === 'route.location' && item.airport) {
          return item.airport.Name.toLowerCase() === fromAirport.toLowerCase();
        }
        if (fromCity && item.__component === 'route.destination' && item.city) {
          return item?.city?.title?.toLowerCase() === fromCity.toLowerCase();
        }
        return false;
      });

      // Filter dropoff items
      const hasMatchingDropoff = dropoffItems.some(item => {
        if (fromAirport && item.__component === 'route.location' && item.airport) {
          return item.airport.Name.toLowerCase() === fromAirport.toLowerCase();
        }
        if (fromCity && item.__component === 'route.destination' && item.city) {
          return item?.city?.title?.toLowerCase() === fromCity?.toLowerCase();
        }
        return false;
      });

      // Return true if either pickup or dropoff matches
      return hasMatchingPickup || hasMatchingDropoff;
    });

    if(dropoff){
      const matchedRoutes = filteredRoutes?.filter(route=>{
        return (route?.pickup[0]?.airport?.Name?.toLowerCase() === dropoff.toLowerCase() || route?.pickup[0]?.city?.title?.toLowerCase() === dropoff.toLowerCase() || 
        route?.dropoff[0]?.airport?.Name?.toLowerCase() === dropoff.toLowerCase() || route?.dropoff[0]?.city?.title?.toLowerCase() === dropoff.toLowerCase())
      })
      ctx.body = matchedRoutes;
    } else{
      // Attach filtered results to the context
      ctx.body = filteredRoutes;
    }

    // Proceed to the next middleware
    await next();
  };
};


