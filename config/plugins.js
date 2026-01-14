// module.exports = ({ env }) => ({
//     email: {
//       config: {
//         provider: 'sendgrid',
//         providerOptions: {
//           apiKey: env('SENDGRID_API_KEY'),
//         },
//         settings: {
//           defaultFrom: 'booking@bergamo-transfers.com',
//           defaultReplyTo: 'booking@bergamo-transfers.com',
//         },
//       },
//     },
//   });


module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env.int('SMTP_PORT', 587),
        secure: env('SMTP_SECURE', false), // Use `true` for port 465
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
          defaultFrom: 'booking@milan-transfers.com',
          defaultReplyTo: 'booking@milan-transfers.com',
        },
    },
  },
});