// index.js (pagamento-service)
require('dotenv').config();
const express      = require('express');
const bodyParser   = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');

const app = express();
app.use(bodyParser.json());

const baseUrl = process.env.API_BASE_URL || 'http://localhost:5001';
const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Pagamento Service API',
      version: '1.0.0',
      description: 'QR Code & Fake-Checkout via Mercado Pago',
    },
    servers: [{ url: baseUrl }],
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: [
    './src/interfaces/http/routes/authRoutes.js',
    './src/interfaces/http/routes/pagamentoRoutes.js'
  ]
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Rotas de Autenticação (sem token) ────────────────────────────────────────
app.use('/api/auth', require('./src/interfaces/http/routes/authRoutes'));

// ─── Protege as rotas abaixo com Cognito JWT ──────────────────────────────────
const verifyToken = require('./src/interfaces/http/middlewares/verifyToken');

// ─── Rotas de Pagamento ──────────────────────────────────────────────────────
app.use('/pagamento', verifyToken, require('./src/interfaces/http/routes/pagamentoRoutes'));

// ─── Healthcheck ─────────────────────────────────────────────────────────────
app.get('/',      (_req, res) => res.send('Pagamento Service is running.'));
app.get('/health',(_req, res) => res.sendStatus(200));

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Pagamento Service listening on http://localhost:${PORT}`);
  console.log(`📘 Swagger at ${baseUrl}/api-docs`);
});
