module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'sendgrid',
        providerOptions: {
          apiKey: env('SENDGRID_API_KEY'),
        },
        settings: {
          defaultFrom: 'booking@bergamo-transfers.com',
          defaultReplyTo: 'booking@bergamo-transfers.com',
        },
      },
    },
  });