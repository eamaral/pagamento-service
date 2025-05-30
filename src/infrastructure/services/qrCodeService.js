// src/infrastructure/services/qrCodeService.js
const mercadopago = require('mercadopago');

const mp = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

async function gerarQrCode(pedido) {
  try {
    const preference = {
      items: [{
        title: `Pedido ${pedido.id}`,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: pedido.total
      }],
      back_urls: {
        success: process.env.MERCADOPAGO_NOTIFICATION_URL || 'http://localhost:5001',
        failure: process.env.MERCADOPAGO_NOTIFICATION_URL || 'http://localhost:5001',
        pending: process.env.MERCADOPAGO_NOTIFICATION_URL || 'http://localhost:5001'
      },
      auto_return: 'approved',
      notification_url: process.env.MERCADOPAGO_NOTIFICATION_URL
    };

    const response = await mp.preference.create({ body: preference });

    return {
      qrCodeUrl: response.init_point,
      mercadoPagoId: response.id
    };
  } catch (err) {
    console.error('Erro ao gerar QR code:', err);
    throw new Error('Erro ao gerar QR code');
  }
}

module.exports = { gerarQrCode };
