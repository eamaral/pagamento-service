// src/infrastructure/services/qrCodeService.js
const mercadopago = require('mercadopago');

const mp = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const preferenceClient = new mercadopago.Preference(mp); // 👈 instância da nova classe Preference

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
        success: process.env.MERCADOPAGO_SUCCESS_URL || 'http://localhost:5001/success',
        failure: process.env.MERCADOPAGO_FAILURE_URL || 'http://localhost:5001/failure',
        pending: process.env.MERCADOPAGO_PENDING_URL || 'http://localhost:5001/pending'
      },
      auto_return: 'approved',
      notification_url: process.env.MERCADOPAGO_NOTIFICATION_URL
    };

    const response = await preferenceClient.create({ body: preference }); // ✅

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
