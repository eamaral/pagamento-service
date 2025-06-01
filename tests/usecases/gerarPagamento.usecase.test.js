// tests/usecases/gerarPagamento.usecase.test.js

const GerarPagamentoUseCase = require('../../src/application/usecases/gerarPagamento');

const pedidoFake = { id: 3, total: 50.0 };
const qrCodeFake = {
  qrCodeUrl: 'https://fake.qr.code',
  mercadoPagoId: 'fake-id'
};
const pagamentoFake = {
  id: 'fake-uuid',
  pedidoId: '3',
  qrCode: qrCodeFake,
  status: 'Pendente',
  createdAt: new Date().toISOString()
};

jest.mock('../../src/domain/repositories/pedidoApiRepository');
jest.mock('../../src/infrastructure/services/qrCodeService', () => ({
  gerarQrCode: jest.fn()
}));
jest.mock('../../src/domain/repositories/pagamentoRepository');

const PedidoApiRepository = require('../../src/domain/repositories/pedidoApiRepository');
const { gerarQrCode } = require('../../src/infrastructure/services/qrCodeService');
const PagamentoRepository = require('../../src/domain/repositories/pagamentoRepository');

describe('GerarPagamentoUseCase', () => {
  let usecase;

  beforeEach(() => {
    PedidoApiRepository.mockImplementation(() => ({
      setAuth: jest.fn(),
      findById: jest.fn().mockResolvedValue(pedidoFake)
    }));

    gerarQrCode.mockResolvedValue(qrCodeFake);

    PagamentoRepository.mockImplementation(() => ({
      create: jest.fn().mockResolvedValue(pagamentoFake)
    }));

    usecase = new GerarPagamentoUseCase({ authHeader: 'Bearer token' });
  });

  it('deve gerar um pagamento com sucesso', async () => {
    const result = await usecase.execute('3');

    expect(result).toEqual(pagamentoFake);
    expect(gerarQrCode).toHaveBeenCalledWith(pedidoFake);
  });

  it('deve lançar erro se pedidoId não for informado', async () => {
    await expect(usecase.execute()).rejects.toThrow('O pedidoId é obrigatório para gerar o QR Code.');
  });

  it('deve lançar erro se pedido não for encontrado', async () => {
    PedidoApiRepository.mockImplementation(() => ({
      setAuth: jest.fn(),
      findById: jest.fn().mockResolvedValue(null)
    }));

    const usecaseWithPedidoNotFound = new GerarPagamentoUseCase({ authHeader: 'Bearer token' });

    await expect(usecaseWithPedidoNotFound.execute('999')).rejects.toThrow('Pedido com ID 999 não encontrado.');
  });
});
