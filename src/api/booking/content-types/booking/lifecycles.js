module.exports = {
    async afterCreate(event){
        const {result} = event;
        console.log(result);
        
        try {
            if(result?.Booking_Status === "pending"){
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'We have received your booking!',
                    text: 'Thanks! We have received your bookings and will get back to you as soon as possible.'
                })
                await strapi.plugins['email'].services.email.send({
                    to: ["edgars.bomiks@gmail.com", "freelancer.shuvobaroi@gmail.com"],
                    from: 'booking@bergamo-transfers.com',
                    subject: `New booking received from ${result?.firstName} ${result?.lastName}`,
                    text: `New booking received from ${result?.firstName} ${result?.lastName}. Here are the bookign details:-
                    Name: ${result?.firstName} ${result?.lastName}
                    Email: ${result?.email}
                    Phone: ${result?.phone} 
                    Route: ${result?.route}
                    Vehicle Type: ${result?.vehicle_type} 
                    Price: ${result?.price} 
                    Return Trip: ${result?.returnTrip} 
                    Pickup Date: ${result?.pickupDate} 
                    Pickup Time: ${result?.pickupTime}
                    Dropoff Date: ${result?.dropoffDate} 
                    Dropoff Time: ${result?.dropoffTime} `
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
    async afterUpdate(event){
        const {result} = event;
        console.log(result);
        
        try {
            if(result?.Booking_Status === "running"){
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'Congratulations! Your Booking has been Confirmed!',
                    text: 'Thanks! We have assigned a driver and will get back to you as soon as possible.'
                })
            }

        } catch (error) {
            console.log(error);
        }
    },
}