// src/application/usecases/gerarPagamento.js
const PedidoApiRepository = require('../../domain/repositories/pedidoApiRepository');
const QrCodeService       = require('../../infrastructure/services/qrCodeService');
const PagamentoRepository = require('../../domain/repositories/pagamentoRepository');

class GerarPagamentoUseCase {
  constructor({ authHeader }) {
    this.pedidoRepo   = new PedidoApiRepository();
    this.pedidoRepo.setAuth(authHeader);
    this.qrCodeService = new QrCodeService();
    this.pagamentoRepo = new PagamentoRepository();
  }

  async execute(pedidoId) {
    if (!pedidoId) {
      throw new Error('O pedidoId é obrigatório para gerar o QR Code.');
    }

    const pedido = await this.pedidoRepo.findById(pedidoId);
    if (!pedido) {
      throw new Error(`Pedido com ID ${pedidoId} não encontrado.`);
    }

    const qrCode = await this.qrCodeService.gerarQrCode(pedido);
    const pagamento = await this.pagamentoRepo.create({
      pedidoId: String(pedido.id),
      qrCode,
      status:  'Pendente'
    });

    return pagamento;
  }
}

module.exports = GerarPagamentoUseCase;
