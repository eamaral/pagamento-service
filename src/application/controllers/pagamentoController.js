// src/application/controllers/pagamentoController.js
const GerarPagamentoUseCase = require('../usecases/gerarPagamento');
const PedidoApiRepository   = require('../../domain/repositories/pedidoApiRepository');

exports.gerarPagamento = async (req, res) => {
  const { pedidoId } = req.body;
  const authHeader   = req.headers.authorization;
  try {
    const useCase = new GerarPagamentoUseCase({ authHeader });
    const result  = await useCase.execute(pedidoId);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao gerar pagamento:', error.message);
    const isNotFound = error.message.includes('não encontrado');
    return res
      .status(isNotFound ? 404 : 400)
      .json({ error: error.message });
  }
};

exports.fakeCheckout = async (req, res) => {
  const { pedidoId }  = req.body;
  const authHeader    = req.headers.authorization;
  const repo          = new PedidoApiRepository();
  repo.setAuth(authHeader);

  try {
    const updated = await repo.atualizarStatus(pedidoId, 'Em Preparação');
    return res.status(200).json({
      message:  'Pedido pago com sucesso e está em preparação.',
      pedidoId: updated.id,
      status:   updated.status
    });
  } catch (error) {
    console.error('Erro no fakeCheckout:', error.message);
    const isNotFound = error.message.includes('não encontrado');
    return res
      .status(isNotFound ? 404 : 500)
      .json({ error: error.message });
  }
};
