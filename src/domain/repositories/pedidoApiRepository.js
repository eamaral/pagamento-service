const axios = require('axios');

class PedidoApiRepository {
  constructor() {
    const base = process.env.API_BASE_URL;
    this.baseUrl = `${base}/api/pedidos`;
    this.authHeader = null;
  }

  setAuth(header) {
    this.authHeader = header;
  }

  async findById(pedidoId) {
    try {
      const resp = await axios.get(
        `${this.baseUrl}/${pedidoId}`,
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
        `${this.baseUrl}/preparacao`,
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
