const PedidoApiRepository = require('../../domain/repositories/pedidoApiRepository');
const { gerarQrCode } = require('../../infrastructure/services/qrCodeService');
const PagamentoRepository = require('../../domain/repositories/pagamentoRepository');

class GerarPagamentoUseCase {
  constructor({ authHeader }) {
    this.pedidoRepo   = new PedidoApiRepository();
    this.pedidoRepo.setAuth(authHeader);
    this.gerarQrCode = gerarQrCode;
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

    const qrCode = await this.gerarQrCode(pedido);
    const pagamento = await this.pagamentoRepo.create({
      pedidoId: String(pedido.pedidoId || pedido.id),
      qrCode,
      status:  'Pendente'
    });

    return pagamento;
  }
}

module.exports = GerarPagamentoUseCase;
