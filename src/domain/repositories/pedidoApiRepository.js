// src/domain/repositories/pedidoApiRepository.js
const axios = require('axios');

class PedidoApiRepository {
  constructor() {
    this.baseUrl = process.env.PEDIDO_SERVICE_URL;
    this.authHeader = null;
  }

  setAuth(header) {
    this.authHeader = header;
  }

  async findById(pedidoId) {
    try {
      const resp = await axios.get(
        `${this.baseUrl}/pedidos/${pedidoId}`,
        { headers: { Authorization: this.authHeader } }
      );
      return resp.data;
    } catch (err) {
      if (err.response?.status === 404) {
        throw new Error(`Pedido com ID ${pedidoId} não encontrado.`);
      }
      throw new Error(`Erro ao consultar Pedido Service: ${err.message}`);
    }
  }

  async atualizarStatus(pedidoId) {
    try {
      const resp = await axios.post(
        `${this.baseUrl}/pedidos/preparacao`,
        { pedidoId },
        { headers: { Authorization: this.authHeader } }
      );
      return resp.data;
    } catch (err) {
      if (err.response?.status === 404) {
        throw new Error(`Pedido com ID ${pedidoId} não encontrado.`);
      }
      throw new Error(`Erro ao atualizar status no Pedido Service: ${err.message}`);
    }
  }
}

module.exports = PedidoApiRepository;
