// module.exports = {
//     async afterCreate(event){
//         const {result} = event;
//         console.log(result);

const dayjs = require("dayjs");

        
//         try {
//             if(result?.Booking_Status === "pending"){
//                 await strapi.plugins['email'].services.email.send({
//                     to: result?.email,
//                     from: 'booking@bergamo-transfers.com',
//                     subject: 'We have received your booking!',
//                     text: 'Thanks! We have received your bookings and will get back to you as soon as possible.'
//                 })
//                 await strapi.plugins['email'].services.email.send({
//                     to: ["edgars.bomiks@gmail.com", "freelancer.shuvobaroi@gmail.com"],
//                     from: 'booking@bergamo-transfers.com',
//                     subject: `New booking received from ${result?.firstName} ${result?.lastName}`,
//                     text: `New booking received from ${result?.firstName} ${result?.lastName}. Here are the bookign details:-
//                     Name: ${result?.firstName} ${result?.lastName}
//                     Email: ${result?.email}
//                     Phone: ${result?.phone} 
//                     Route: ${result?.route}
//                     Vehicle Type: ${result?.vehicle_type} 
//                     Price: ${result?.price} 
//                     Return Trip: ${result?.returnTrip} 
//                     Pickup Date: ${result?.pickupDate} 
//                     Pickup Time: ${result?.pickupTime}
//                     Dropoff Date: ${result?.dropoffDate} 
//                     Dropoff Time: ${result?.dropoffTime} `
//                 });
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     },
//     async afterUpdate(event){
//         const {result} = event;
//         console.log(result);
        
//         try {
//             if(result?.Booking_Status === "accepted"){
//                 await strapi.plugins['email'].services.email.send({
//                     to: result?.email,
//                     from: 'booking@bergamo-transfers.com',
//                     subject: 'Congratulations! Your Booking has been Confirmed!',
//                     text: 'Thanks! We have assigned a driver and will get back to you as soon as possible.'
//                 })
//             }

//         } catch (error) {
//             console.log(error);
//         }
//     },
// }




module.exports = {
    async afterCreate(event) {
        const { result } = event;
        console.log(result);

        const formattedTime = dayjs(`${result.pickupDate}T${result.pickupTime}`).format('h:mm A');
        try {
            // if (result?.Booking_Status === "pending") {
            //     // Notification to the customer
            //     await strapi.plugins['email'].services.email.send({
            //         to: result?.email,
            //         from: 'booking@bergamo-transfers.com',
            //         subject: 'We have received your booking!',
            //         text: `Thank you! We have received your booking and will get back to you soon.`
            //     });

            //     // Notification to admin
            //     await strapi.plugins['email'].services.email.send({
            //         to: ["edgars.bomiks@gmail.com", "freelancer.shuvobaroi@gmail.com"],
            //         from: 'booking@bergamo-transfers.com',
            //         subject: `New booking received from ${result?.firstName} ${result?.lastName}`,
            //         text: `
            //             New booking details:
            //             - Name: ${result?.firstName} ${result?.lastName}
            //             - Email: ${result?.email}
            //             - Phone: ${result?.phone}
            //             - Route: ${result?.route}
            //             - Vehicle Type: ${result?.vehicle_type}
            //             - Price: ${result?.price}
            //             - Return Trip: ${result?.returnTrip}
            //             - Pickup Date: ${result?.pickupDate}
            //             - Pickup Time: ${result?.pickupTime}
            //             - Dropoff Date: ${result?.dropoffDate}
            //             - Dropoff Time: ${result?.dropoffTime}
            //         `
            //     });
            // }
            if (result?.Booking_Status === "pending") {
                // Email to the customer
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'Your booking has been made!',
                    text: `
                        Dear ${result?.firstName},

                        Thank you for choosing our services!

                        Your booking details:
                        - Booking number: ${result?.id}
                        - Transfer date: ${dayjs(result?.pickupDate).format('MMMM D, YYYY')}
                        - Time: ${formattedTime}
                        - From: ${result?.pickupLocation}
                        - To: ${result?.dropoffLocation}
                        - Number of passengers: ${result?.passengers}
                        - Additional information: ${result?.Comment || "None"}

                        Next steps:
                        Your booking has been successfully made and is being processed. You will receive a confirmation from our partner transfer company shortly.

                        If you have any questions, please do not hesitate to contact us using this email address or by calling.

                        Best regards,
                        Bergamo-transfer.com Team
                    `
                });

                // Email to the customer for the return trip
                if(result?.Booking_Status === "pending" && result?.returnTrip === "yes"){
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'Your return booking has been made!',
                    text: `
                        Dear ${result?.firstName},

                        Thank you for choosing our services!

                        Your return booking details:
                        - Booking number: ${result?.id}
                        - Transfer date: ${dayjs(result?.return_date).format('MMMM D, YYYY')}
                        - Time: ${dayjs(`${result.return_date}T${result.return_time}`).format('h:mm A')}
                        - From: ${result?.dropoffLocation}
                        - To: ${result?.pickupLocation}
                        - Number of passengers: ${result?.passengers}
                        - Additional information: ${result?.Comment || "None"}

                        Next steps:
                        Your return booking has been successfully made and is being processed. You will receive a confirmation from our partner transfer company shortly.

                        If you have any questions, please do not hesitate to contact us using this email address or by calling.

                        Best regards,
                        Bergamo-transfer.com Team
                    `
                });
                }

                // Notification to the admin
                await strapi.plugins['email'].services.email.send({
                    to: ["edgars.bomiks@gmail.com", "freelancer.shuvobaroi@gmail.com"],
                    from: 'booking@bergamo-transfers.com',
                    subject: `New booking received from ${result?.firstName} ${result?.lastName}`,
                    text: `
                        New booking received:
                        - Name: ${result?.firstName} ${result?.lastName}
                        - Email: ${result?.email}
                        - Phone: ${result?.phone}
                        - Route: ${result?.route || "N/A"}
                        - Vehicle Type: ${result?.vehicle_type}
                        - Price: ${result?.price} EUR
                        - Return Trip: ${result?.returnTrip ? "Yes" : "No"}
                        - Pickup Date: ${dayjs(result?.pickupDate).format('MMMM D, YYYY')}
                        - Pickup Time: ${formattedTime}
                        - Dropoff Date: ${result?.dropoffDate || "N/A"}
                        - Dropoff Time: ${result?.dropoffTime || "N/A"}
                    `
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    

    async afterUpdate(event) {
        const { result } = event;
        console.log(result);

        const formattedTime = dayjs(`${result.pickupDate}T${result.pickupTime}`).format('h:mm A');
        
        try {
            if (result?.Booking_Status === "pending") {
                // Email to the customer
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'Your booking has been made!',
                    text: `
                        Dear ${result?.firstName},

                        Thank you for choosing our services!

                        Your booking details:
                        - Booking number: ${result?.id}
                        - Transfer date: ${dayjs(result?.pickupDate).format('MMMM D, YYYY')}
                        - Time: ${formattedTime}
                        - From: ${result?.pickupLocation}
                        - To: ${result?.dropoffLocation}
                        - Number of passengers: ${result?.passengers}
                        - Additional information: ${result?.Comment || "None"}

                        Next steps:
                        Your booking has been successfully made and is being processed. You will receive a confirmation from our partner transfer company shortly.

                        If you have any questions, please do not hesitate to contact us using this email address or by calling.

                        Best regards,
                        Bergamo-transfer.com Team
                    `
                });

                // Email to the customer for the return trip
                if(result?.Booking_Status === "pending" && result?.returnTrip === "yes"){
                    await strapi.plugins['email'].services.email.send({
                        to: result?.email,
                        from: 'booking@bergamo-transfers.com',
                        subject: 'Your return booking has been made!',
                        text: `
                            Dear ${result?.firstName},
    
                            Thank you for choosing our services!
    
                            Your return booking details:
                            - Booking number: ${result?.id}
                            - Transfer date: ${dayjs(result?.return_date).format('MMMM D, YYYY')}
                            - Time: ${dayjs(`${result.return_date}T${result.return_time}`).format('h:mm A')}
                            - From: ${result?.dropoffLocation}
                            - To: ${result?.pickupLocation}
                            - Number of passengers: ${result?.passengers}
                            - Additional information: ${result?.Comment || "None"}
    
                            Next steps:
                            Your return booking has been successfully made and is being processed. You will receive a confirmation from our partner transfer company shortly.
    
                            If you have any questions, please do not hesitate to contact us using this email address or by calling.
    
                            Best regards,
                            Bergamo-transfer.com Team
                        `
                    });
                    }

                // Notification to the admin
                await strapi.plugins['email'].services.email.send({
                    to: ["edgars.bomiks@gmail.com", "freelancer.shuvobaroi@gmail.com"],
                    from: 'booking@bergamo-transfers.com',
                    subject: `New booking received from ${result?.firstName} ${result?.lastName}`,
                    text: `
                        New booking received:
                        - Name: ${result?.firstName} ${result?.lastName}
                        - Email: ${result?.email}
                        - Phone: ${result?.phone}
                        - Route: ${result?.route || "N/A"}
                        - Vehicle Type: ${result?.vehicle_type}
                        - Price: ${result?.price} EUR
                        - Return Trip: ${result?.returnTrip ? "Yes" : "No"}
                        - Pickup Date: ${dayjs(result?.pickupDate).format('MMMM D, YYYY')}
                        - Pickup Time: ${formattedTime}
                        - Dropoff Date: ${result?.dropoffDate || "N/A"}
                        - Dropoff Time: ${result?.dropoffTime || "N/A"}
                    `
                });
            }

            // If booking is accepted
            if (result?.Booking_Status === "accepted") {
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'Congratulations! Your Booking Has Been Confirmed!',
                    text: `Thank you! Your driver has been assigned, and further details will follow.`
                });
            }

            // If booking is accepted and return trip
            if (result?.Booking_Status === "accepted" && result?.returnTrip === "yes") {
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'Congratulations! Your Return Booking Has Been Confirmed!',
                    text: `Thank you! Your driver has been assigned for the return trip from ${result?.dropoffLocation} to ${result?.pickupLocation}, and further details will follow.`
                });
            }

            // If booking is declined and return trip
            if (result?.Booking_Status === "declined" && result?.returnTrip === "yes") {
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'We’re Sorry, Your Return Booking Has Been Declined',
                    text: `
                        Dear ${result?.firstName},

                        Unfortunately, we were unable to confirm your return booking from ${result?.dropoffLocation} to ${result?.pickupLocation} due to unforeseen circumstances.

                        Please feel free to contact us for assistance or to make a new booking.

                        We apologize for any inconvenience caused.

                        Best regards,
                        Bergamo-transfer.com Team
                    `
                });
            }

            // If booking is declined
            if (result?.Booking_Status === "declined") {
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'We’re Sorry, Your Booking Has Been Declined',
                    text: `
                        Dear ${result?.firstName},

                        Unfortunately, we were unable to confirm your booking due to unforeseen circumstances. 
                        Please feel free to contact us for assistance or to make a new booking.

                        We apologize for any inconvenience caused.

                        Best regards,
                        Bergamo-transfer.com Team
                    `
                });
            }

            // If booking is cancelled
            if (result?.Booking_Status === "canceled") {
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'Your Booking Has Been Cancelled',
                    text: `
                        Dear ${result?.firstName},

                        We’re writing to inform you that your booking Booking Number: ${result?.id} has been cancelled. 
                        If you have any questions or need further assistance, please don't hesitate to contact us.

                        Thank you for considering our services, and we hope to serve you in the future.

                        Best regards,
                        Bergamo-transfer.com Team
                    `
                });
            }

            // If booking is cancelled and return trip
            if (result?.Booking_Status === "canceled" && result?.returnTrip === "yes") {
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@bergamo-transfers.com',
                    subject: 'Your Return Booking Has Been Cancelled',
                    text: `
                        Dear ${result?.firstName},

                        We’re writing to inform you that your return booking Booking Number: ${result?.id} has been cancelled. 
                        If you have any questions or need further assistance, please don't hesitate to contact us.

                        Thank you for considering our services, and we hope to serve you in the future.

                        Best regards,
                        Bergamo-transfer.com Team
                    `
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
};
