require('dotenv').config();
module.exports = {
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  sandbox:     true,
  notificationUrl: process.env.NOTIFICATION_URL || 'http://localhost:5001'
};
