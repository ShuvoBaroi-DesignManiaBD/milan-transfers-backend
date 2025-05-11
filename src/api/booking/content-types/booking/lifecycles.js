const dayjs = require("dayjs");


module.exports = {
    async afterCreate(event) {
        let {
            result
        } = event;
        // Fetch the full data, including components
        result = await strapi.entityService.findOne('api::booking.booking', result.id, {
            populate: ['children_seats'] // Add other components or relations if needed
        });

        const users = await strapi.query('admin::user').findMany({
            select: ['id', 'email', 'firstname', 'lastname'],
            populate: {
                roles: {
                    select: ['name', 'code']
                }
            },
            where: {
                isActive: true
            }
        });

        const partners = users.filter(user => user.roles.some(role => role.name === 'Partner'))?.map(user => user.email);

        // const adminUsers = await strapi.query('users-permissions').find({

        //     populate: ['roles'],
        //     filters: {
        //       roles: { $contains: 'administrator' } // Filter for users with 'administrator' role
        //     }
        //   });

        // const adminUsers = await strapi.admin.services.user.findMany();

        const formattedTime = dayjs(`${result.pickupDate}T${result.pickupTime}`).format('h:mm A');
        console.log(result, partners, formattedTime);
        console.log('flight time ===>', dayjs(result?.flight_arrival_time || result?.flight_departure_time, 'HH:mm:ss.SSS').format('h:mm A'));
    },

    async afterUpdate(event) {
        let {
            result,
            ...rest
        } = event;

        const indent = (str, spaces = 16) => str.split('\n').map(line => ' '.repeat(spaces) + line).join('\n');

        const users = await strapi.query('admin::user').findMany({
            select: ['id', 'email', 'firstname', 'lastname'],
            populate: {
                roles: {
                    select: ['name', 'code']
                }
            },
            where: {
                isActive: true
            }
        });


        const partners = users.filter(user => user.roles.some(role => role.name === 'Partner'))?.map(user => user.email);
        console.log(result, partners);

        // Fetch the full data, including related components
        result = await strapi.entityService.findOne('api::booking.booking', result.id, {
            populate: ['children_seats']
        });

        console.log(result, rest);

        // Format pickup time
        const formattedTime = dayjs(`${result.pickupDate}T${result.pickupTime}`).format('h:mm A');
        const formateTime = (timeString) => {
            if (!timeString) return 'N/A';
            const today = dayjs().format('YYYY-MM-DD'); // Get today's date
            return dayjs(`${today}T${timeString}`).format('h:mm A');
        };

        // Construct booking details
        const contactDetails = `- Name: ${result?.firstName || ''} ${result?.lastName || ''}
        - Phone nr: ${result?.phone || ''}
        - Email: ${result?.email || ''}`;

        const contactDetailsforPartner = `- Name: ${result?.firstName || ''} ${result?.lastName || ''}
        - Phone nr: ${result?.phone || ''}
        `;

        const bookingInfo = `- Number of passengers: ${result?.passengers || 'N/A'}
        - Children's chairs: ${result?.children_seats.map(seat => `Age ${seat?.age}`).join(', ') || 'N/A'}
        - Car: ${result?.vehicle_type || 'N/A'}
        - Price: ${result?.price || 'N/A'}
        `;

        const luggageSkiAndNotes = `- Small luggage: ${result?.small_luggage || 'N/A'}
        - Big luggage: ${result?.big_luggage || 'N/A'}
        - Ski: ${result?.ski || 'N/A'}
        - Notes: ${result?.Comment || 'N/A'}`;

        const pickupAddress = `- Pick up address: ${result?.pickupAddress || 'N/A'}
        - Pickup hotel: ${result?.pickupHotel || 'N/A'}
        - Pickup house: ${result?.pickupHouse || 'N/A'}
        - Pickup nearby: ${result?.pickupNearby || 'N/A'}`;

        const dropoffAddress = `- Drop off address: ${result?.dropoffAddress || 'N/A'}
        - Dropoff hotel: ${result?.dropoffHotel || 'N/A'}
        - Dropoff house: ${result?.dropoffHouse || 'N/A'}
        - Dropoff nearby: ${result?.dropoffNearby || 'N/A'}`;

        const pickupLocation = result ?.pickupLocation || 'N/A';
        const dropoffLocation = result ?.dropoffLocation || 'N/A';

        const clientWelcomeMessage = await result?.Booking_Status === "pending" ?
            `Dear ${result?.firstName},
        Thank you for your transfer booking. This email confirms that we have received your transfer reservation.` : await result?.Booking_Status === "accepted" && `Dear ${result?.firstName},
        Thank you for your transfer booking. This email confirms that your transfer reservation is confirmed.`;

        const partnerWelcomeMessage = await result?.Booking_Status === "pending" ? `
        Dear Partner,
        You have new reservation. Please confirm asap.` : await result?.Booking_Status === "accepted" && `
        Dear Partner,
        Please find clients details for this transfer.`;

        const clientWaitingMessage = pickupLocation.toLowerCase().includes("airport") ?
            "Driver will wait for you in the arrival zone with your name on board. Waiting time: 1 hour after landing." :
            "Driver will wait for you in the hotel lobby or very near to your pick-up place. Waiting time: 15 minutes starting from your pick-up time.";


        // console.log('flight time ===>', result?.flight_arrival_time, result?.flight_departure_time, dayjs(result?.flight_arrival_time || result?.flight_departure_time, 'HH:mm:ss.SSS').format('h:mm A'), dayjs(result?.flight_arrival_time || result?.flight_departure_time, 'HH:mm:ss.SSS'), dayjs(result?.flight_arrival_time || result?.flight_departure_time));
        // console.log('flight time 2 ===>', result?.flight_arrival_time, result?.flight_departure_time);

        const generateEmailBody = ({
            returnTrip = false,
            sendTo = 'client'
        }) => {
            // Indentation helper function
            const indent = (str, spaces = 16) =>
                str.split('\n').map(line => ' '.repeat(spaces) + line).join('\n');

            // Define email components
            const contactDetails = `
      - Name: ${result?.firstName || ''} ${result?.lastName || ''}
      - Phone nr: ${result?.phone || ''}
      - Email: ${result?.email || ''}`;

            const contactDetailsForPartner = `
      - Name: ${result?.firstName || ''} ${result?.lastName || ''}
      - Phone nr: ${result?.phone || ''}`;

            const bookingInfo = `
      - Number of passengers: ${result?.passengers || 'N/A'}
      - Children's chairs: ${result?.children_seats?.length > 0 
          ? result.children_seats.map(seat => `Age ${seat?.age}`).join(', ') 
          : 'N/A'}
      - Car: ${result?.vehicle_type || 'N/A'}
      - Price: ${result?.price ? `€${result.price}` : 'N/A'}`;

            const luggageSkiAndNotes = `
      - Small luggage: ${result?.small_luggage || 'N/A'}
      - Big luggage: ${result?.big_luggage || 'N/A'}
      - Ski: ${result?.ski || 'N/A'}
      - Notes: ${result?.Comment || 'N/A'}`;

            const pickupAddress = `
      - Pick up address: ${result?.pickupAddress || 'N/A'}
      - Pickup hotel: ${result?.pickupHotel || 'N/A'}
      - Pickup house: ${result?.pickupHouse || 'N/A'}
      - Pickup nearby: ${result?.pickupNearby || 'N/A'}`;

            const dropoffAddress = `
      - Drop off address: ${result?.dropoffAddress || 'N/A'}
      - Dropoff hotel: ${result?.dropoffHotel || 'N/A'}
      - Dropoff house: ${result?.dropoffHouse || 'N/A'}
      - Dropoff nearby: ${result?.dropoffNearby || 'N/A'}`;

            // Build transfer details
            const transferDetails = `
      ${indent(`
      - Booking number: ${result?.id}
      ${contactDetails}
      - Pick up: ${result?.pickupLocation}
      - Transfer to: ${result?.dropoffLocation}
      - Pickup date: ${dayjs(result?.pickupDate).format('MMMM D, YYYY')}
      - Pickup time: ${formattedTime}
      - Flight Nr: ${result?.arrival_flight_number || result?.departure_flight_number || 'N/A'}
      - Flight time: ${formateTime(result?.flight_arrival_time || result?.flight_departure_time) || 'N/A'}
      ${indent(bookingInfo, 0)}
      ${indent(result?.pickupLocation?.toLowerCase().includes("airport") 
          ? dropoffAddress 
          : pickupAddress, 0)}
      ${indent(luggageSkiAndNotes, 0)}`, 0)}`;

            // Build return details if needed
            let returnDetails = '';
            if (returnTrip) {
                returnDetails = `
      ${indent(`
      Departure transfer:
      - Booking number: ${result?.id}
      ${indent(contactDetails, 0)}
      - Pick up: ${result?.dropoffLocation}
      - Transfer to: ${result?.pickupLocation}
      - Pickup date: ${dayjs(result?.return_date).format('MMMM D, YYYY')}
      - Pickup time: ${formateTime(result?.return_time)}
      ${result?.departure_flight_number ? `- Flight Nr: ${result.departure_flight_number}` : ''}
      ${result?.flight_departure_time ? `- Flight time: ${formateTime(result?.flight_departure_time)}` : ''}
      ${indent(!result?.dropoffLocation?.toLowerCase().includes("airport") 
          ? pickupAddress 
          : dropoffAddress, 0)}
      ${indent(luggageSkiAndNotes, 0)}`, 0)}`;
            }

            // Client template
            if (sendTo === 'client') {
                return `
      ${clientWelcomeMessage}
      
      Your booking details:
      ${transferDetails}
      ${returnTrip ? returnDetails : ''}
      
      ${result?.Booking_Status === "pending" ? `
      Next steps:
      Your booking has been successfully made and is being processed. You will receive a confirmation email from our partner transfer company shortly.
      
      If you have any questions, please do not hesitate to contact us using this email address.
      
      Have a nice trip!
      
      Best regards,
      Milan-transfers.com Team` : ''}
      
      ${result?.Booking_Status === "accepted" ? `
      ${clientWaitingMessage}
      
      If you have any questions, please do not hesitate to contact us using this email address.
      
      Have a nice trip!
      
      Best regards,
      Milan-transfers.com Team` : ''}`;
            }

        // Partner template
        if (sendTo === 'partner') {
                return `
      ${partnerWelcomeMessage}
      
      Booking Details:
      ${transferDetails.replace(contactDetails, contactDetailsForPartner)}
      ${returnTrip ? returnDetails.replace(contactDetails, contactDetailsForPartner) : ''}
      
      ${result?.Booking_Status === "pending" ? `
      Next steps:
      Please confirm booking:
      For confirmation, please reply to this mail by "Yes, I confirm".
      For decline, please reply to this mail by "No, I decline" & the reason why you declined.` : ''}
      
      Thank you for cooperation!
      Milan-transfers.com Team`;
            }

            return '';
        };


        try {
            // Handle 'pending' status: Send booking received email
            if (result?.Booking_Status === "pending") {

                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@milan-transfers.com',
                    subject: 'Your airport transfer booking has been made!',
                    text: generateEmailBody({
                        sendTo: 'client',
                        returnTrip: result.returnTrip === "yes"
                    })
                });

                await strapi.plugins['email'].services.email.send({
                    to: partners,
                    from: 'booking@milan-transfers.com',
                    subject: `You have new transfer reservation nr ${result?.id}`,
                    text: generateEmailBody({
                        sendTo: 'partner',
                        returnTrip: result.returnTrip === "yes"
                    })
                });
            }

            // Handle 'accepted' status: Send booking confirmation email
            if (result?.Booking_Status === "accepted") {
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@milan-transfers.com',
                    subject: 'Your airport transfer booking CONFIRMATION',
                    text: generateEmailBody({
                        sendTo: 'client',
                        returnTrip: result.returnTrip === "yes"
                    })
                });

                await strapi.plugins['email'].services.email.send({
                    to: partners,
                    from: 'booking@milan-transfers.com',
                    subject: `Clients details for reservation nr: ${result?.id}`,
                    text: generateEmailBody({
                        sendTo: 'partner',
                        returnTrip: result.returnTrip === "yes"
                    })
                });
            }

            if (result?.Booking_Status === "declined") {
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@milan-transfers.com',
                    subject: `Your transfer booking nr ${result?.id} has been canceled`,
                    text: 
`Dear ${result?.firstName},
Thank you for booking your transfer. Unfortunately, we are unable to process this transfer, so we have to cancel it. The money will be refunded within 3 business days. The receipt depends on how quickly your bank processes the transaction.
                    
Have a nice day!

Best regards,
Milan-transfers.com Team`
                });

                await strapi.plugins['email'].services.email.send({
                    to: partners,
                    from: 'booking@milan-transfers.com',
                    subject: `Transfer cancelation for booking nr: ${result?.id}`,
                    text: 
`This transfer is canceled by one of the partner.
Thank you for cooperation!
                    
Best regards,
Milan-transfers.com Team`
                });
            }

            if (result?.Booking_Status === "canceled") {
                await strapi.plugins['email'].services.email.send({
                    to: result?.email,
                    from: 'booking@milan-transfers.com',
                    subject: `Your transfer booking nr ${result?.id} has been canceled`,
                    text: 
`Dear ${result?.firstName},
Thank you for cancelation your booking nr: ${result?.id} The refund will be processed within 3 business days. The refund will be processed based on the booking/cancellation policy. The receipt depends on how quickly your bank processes the transaction.

Have a nice day!
                    
Best regards,
Milan-transfers.com Team`.trim()
                });

                await strapi.plugins['email'].services.email.send({
                    to: partners,
                    from: 'booking@milan-transfers.com',
                    subject: `Transfer cancelation for booking nr: ${result?.id}`,
                    text: 
`This transfer is canceled by client.
Thank you for cooperation!

Best regards,
Milan-transfers.com Team`
                });
            }
        } catch (error) {
            console.error("Error sending booking confirmation email:", error);
        }
    }
};