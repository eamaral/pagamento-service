const AWS = require('aws-sdk');
const uuid = require('uuid');

const options = { region: process.env.AWS_REGION };
if (process.env.NODE_ENV === 'local') {
  options.endpoint = process.env.DYNAMODB_ENDPOINT;
}
const client = new AWS.DynamoDB.DocumentClient(options);

class PagamentoRepository {
  constructor() {
    this.table = process.env.DYNAMODB_TABLE_NAME;
  }

  async create({ pedidoId, qrCode, status }) {
    const item = {
      id:        uuid.v4(),
      pedidoId,
      qrCode,
      status,
      createdAt: new Date().toISOString(),
    };
    await client.put({ TableName: this.table, Item:item }).promise();
    return item;
  }
}

module.exports = PagamentoRepository;
