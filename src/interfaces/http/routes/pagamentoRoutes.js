const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const pagamentoController = require('../../../application/controllers/pagamentoController');

//Rota pública para webhook do Mercado Pago
/**
 * @swagger
 * /pagamento/notificar:
 *   post:
 *     summary: Webhook do Mercado Pago (notificação de pagamento)
 *     tags:
 *       - Pagamento
 *     responses:
 *       '200':
 *         description: Notificação recebida com sucesso.
 */
router.post('/notificar', pagamentoController.receberNotificacao);

//Middleware aplicado somente a rotas privadas
router.use(verifyToken);

/**
 * @swagger
 * /pagamento/gerar:
 *   post:
 *     summary: Gera um QR Code para pagamento via Mercado Pago.
 *     tags: [Pagamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       '201':
 *         description: QR Code gerado com sucesso.
 *       '400':
 *         description: pedidoId inválido ou falha.
 *       '404':
 *         description: Pedido não encontrado.
 *       '500':
 *         description: Erro interno.
 */
router.post('/gerar', pagamentoController.gerarPagamento);

/**
 * @swagger
 * /pagamento/fake-checkout:
 *   post:
 *     summary: Simula um checkout para pagamento de um pedido.
 *     tags: [Pagamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       '200':
 *         description: Pedido marcado como pago.
 *       '404':
 *         description: Pedido não encontrado.
 *       '500':
 *         description: Erro interno.
 */
router.post('/fake-checkout', pagamentoController.fakeCheckout);

module.exports = router;
