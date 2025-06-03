require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(bodyParser.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Pagamento Service API',
      version: '1.0.0',
      description: 'QR Code & Fake-Checkout via Mercado Pago',
    },
    servers: [
      { url: process.env.API_BASE_URL || 'http://localhost:5001', description: 'API Swagger' }
    ],
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
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/pagamento-docs', swaggerUi.serve);
app.get('/pagamento-docs', (_req, res) => res.redirect('/pagamento-docs/'));
app.get('/pagamento-docs/', swaggerUi.setup(swaggerSpec));

// ─── Rotas públicas ───────────────────────────────────────────────
app.use('/api/auth', require('./src/interfaces/http/routes/authRoutes'));

// ─── Rotas protegidas ─────────────────────────────────────────────
const verifyToken = require('./src/interfaces/http/middlewares/verifyToken');
app.use('/api/pagamentos', verifyToken, require('./src/interfaces/http/routes/pagamentoRoutes'));

// ─── Healthcheck ──────────────────────────────────────────────────
app.get('/health', (_req, res) => res.sendStatus(200));

// ─── Log das rotas ────────────────────────────────────────────────
console.log('🧩 Rotas registradas:');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(handler.route.path);
      }
    });
  }
});

// ─── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Pagamento Service rodando na porta ${PORT}`);
});
