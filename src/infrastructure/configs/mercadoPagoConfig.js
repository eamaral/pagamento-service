require('dotenv').config();

module.exports = {
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  sandbox: true,
  notificationUrl: process.env.MERCADOPAGO_NOTIFICATION_URL 
};
