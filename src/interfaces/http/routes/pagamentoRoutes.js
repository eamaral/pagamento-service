const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const pagamentoController = require('../../../application/controllers/pagamentoController');

router.use(verifyToken);

/**
 * @swagger
 * /api/pagamento/gerar:
 *   post:
 *     summary: Gera um QR Code para pagamento via Mercado Pago.
 *     tags:
 *       - Pagamento
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCode:
 *                   type: string
 *       '400':
 *         description: pedidoId inválido ou outra falha.
 *       '404':
 *         description: Pedido não encontrado.
 *       '500':
 *         description: Erro interno.
 */
router.post('/gerar', pagamentoController.gerarPagamento);

/**
 * @swagger
 * /api/pagamento/fake-checkout:
 *   post:
 *     summary: Simula um checkout para pagamento de um pedido.
 *     tags:
 *       - Pagamento
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
 *         description: Pedido marcado como pago e em preparação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pedidoId:
 *                   type: string
 *                 status:
 *                   type: string
 *       '404':
 *         description: Pedido não encontrado.
 *       '500':
 *         description: Erro interno.
 */
router.post('/fake-checkout', pagamentoController.fakeCheckout);

module.exports = router;
