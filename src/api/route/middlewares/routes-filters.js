// "use strict";

// module.exports = (config, { strapi }) => {
//   return async (ctx, next) => {
//     const { fromAirport, fromCity, dropoff, landing } = ctx.query;
    
//     if ((!fromAirport && !fromCity) || (!landing || landing !== "yes") ) {
//       // If no filtering query, skip middleware
//       return next();
//     }


//     console.log(landing);

//     // Fetch all routes with populated relations
//     const routes = await strapi.entityService.findMany('api::route.route', {
//       populate: ["pickup", "pickup.airport", "pickup.city", "dropoff", "dropoff.airport", "dropoff.city", "vehicles", "vehicles.vehicle_type.Thumbnail"],
//     });
    

//     // Filter the results programmatically
//     const filteredRoutes = routes.filter(route => {
//       const pickupItems = route.pickup || [];
//       const dropoffItems = route.dropoff || [];
      
//       // Filter pickup items
//       const hasMatchingPickup = pickupItems.some(item => {
//         if (fromAirport && item.__component === 'route.location' && item.airport) {
//           return item.airport.Name.toLowerCase() === fromAirport.toLowerCase();
//         }
//         if (fromCity && item.__component === 'route.destination' && item.city) {
//           return item?.city?.title?.toLowerCase() === fromCity.toLowerCase();
//         }
        
//         return false;
//       });

//       // Filter dropoff items
//       const hasMatchingDropoff = dropoffItems.some(item => {
//         if (fromAirport && item.__component === 'route.location' && item.airport) {
//           return item.airport.Name.toLowerCase() === fromAirport.toLowerCase();
//         }
//         if (fromCity && item.__component === 'route.destination' && item.city) {
//           return item?.city?.title?.toLowerCase() === fromCity?.toLowerCase();
//         }
//         if (!fromCity && !fromAirport && (landing === "yes") && item.__component === 'route.destination') {
//           return (item?.city?.title?.toLowerCase() === dropoff.toLowerCase() || item.airport.Name.toLowerCase() === dropoff.toLowerCase());
//         }

//         return false;
//       });

//       // Return true if either pickup or dropoff matches
//       return hasMatchingPickup || hasMatchingDropoff;
//     });

//     if(landing !== "yes" && dropoff){
//       const matchedRoutes = filteredRoutes?.filter(route=>{
//         return (route?.pickup[0]?.airport?.Name?.toLowerCase() === dropoff.toLowerCase() || route?.pickup[0]?.city?.title?.toLowerCase() === dropoff.toLowerCase() || 
//         route?.dropoff[0]?.airport?.Name?.toLowerCase() === dropoff.toLowerCase() || route?.dropoff[0]?.city?.title?.toLowerCase() === dropoff.toLowerCase())
//       })
//       ctx.body = matchedRoutes;
//     } else if (landing === "yes" && dropoff && !fromAirport && !fromCity) {
//       const matchedRoutes = filteredRoutes?.filter(route=>{
//         return (route?.dropoff[0]?.airport?.Name?.toLowerCase() === dropoff.toLowerCase() || route?.dropoff[0]?.city?.title?.toLowerCase() === dropoff.toLowerCase())
//       })
//       ctx.body = matchedRoutes;
//     } else{
//       // Attach filtered results to the context
//       ctx.body = filteredRoutes;
//     }

//     // Proceed to the next middleware
//     await next();
//   };
// };





"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { fromAirport, fromCity, dropoff, landing } = ctx.query;
    
    console.log("Landing status:", landing);
    if ((!fromAirport && !fromCity) && landing !== "yes" ) {
      console.log("Iam here")
      return next(); // Skip middleware if no valid filters
    }

    console.log("Landing status:", landing);
    
    // Normalize inputs
    const isLanding = landing?.toLowerCase() === "yes";
    const dropoffQuery = dropoff?.toLowerCase();
    
    // Fetch all routes with populated relations
    const routes = await strapi.entityService.findMany('api::route.route', {
      populate: [
        "pickup", "pickup.airport", "pickup.city", 
        "dropoff", "dropoff.airport", "dropoff.city",
        "vehicles", "vehicles.vehicle_type.Thumbnail",
        "seo",
        "extra_sections"
      ],
    });

    // Filter results
    const filteredRoutes = routes.filter(route => {
      const pickupItems = route.pickup || [];
      const dropoffItems = route.dropoff || [];

      const hasMatchingPickup = pickupItems.some(item => {
        if (fromAirport && item.__component === 'route.location' && item.airport) {
          return item.airport.Name.toLowerCase() === fromAirport.toLowerCase();
        }
        if (fromCity && item.__component === 'route.destination' && item.city) {
          return item?.city?.title?.toLowerCase() === fromCity.toLowerCase();
        }
        return false;
      });

      const hasMatchingDropoff = dropoffItems.some(item => {
        if (fromAirport && item.__component === 'route.location' && item.airport) {
          return item.airport.Name.toLowerCase() === fromAirport.toLowerCase();
        }
        if (fromCity && item.__component === 'route.destination' && item.city) {
          return item?.city?.title?.toLowerCase() === fromCity.toLowerCase();
        }
        if (isLanding && item.__component === 'route.destination') {
          return (item?.city?.title?.toLowerCase() === dropoffQuery || item?.airport?.Name?.toLowerCase() === dropoffQuery);
        }
        return false;
      });

      return hasMatchingPickup || hasMatchingDropoff;
    });

    // Corrected logic for filtering based on `landing`
    if (!isLanding && dropoff) {
      ctx.body = filteredRoutes.filter(route =>
        route?.pickup?.some(pick => pick?.airport?.Name?.toLowerCase() === dropoffQuery || pick?.city?.title?.toLowerCase() === dropoffQuery) ||
        route?.dropoff?.some(drop => drop?.airport?.Name?.toLowerCase() === dropoffQuery || drop?.city?.title?.toLowerCase() === dropoffQuery)
      );
    } else if (isLanding && dropoff && !fromAirport && !fromCity) {
      ctx.body = filteredRoutes.filter(route =>
        route?.dropoff?.some(drop => drop?.airport?.Name?.toLowerCase() === dropoffQuery || drop?.city?.title?.toLowerCase() === dropoffQuery)
      );
    } else {
      ctx.body = filteredRoutes;
    }

    await next();
  };
};
