# 💳 Pagamento Service

Este microsserviço é responsável por gerenciar **pagamentos** de pedidos no sistema da lanchonete. Ele gera QR Codes via **Mercado Pago**, recebe notificações de pagamento e simula finalização para fins de demonstração.

> Projeto baseado em **Clean Architecture**, com separação entre camadas de domínio, casos de uso, interfaces HTTP e infraestrutura.

---

## 📊 SonarCloud

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=eamaral_pagamento-service&metric=alert_status)](https://sonarcloud.io/dashboard?id=eamaral_pagamento-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=eamaral_pagamento-service&metric=coverage)](https://sonarcloud.io/dashboard?id=eamaral_pagamento-service)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=eamaral_pagamento-service&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=eamaral_pagamento-service)

---

## ⚙️ Tecnologias Utilizadas

- Node.js + Express
- AWS ECS Fargate
- DynamoDB (NoSQL)
- Mercado Pago SDK
- Cognito (JWT)
- Docker
- Swagger (documentação)

---

## 🔗 Rotas Principais

| Método | Rota                           | Descrição                                    |
|--------|--------------------------------|----------------------------------------------|
| POST   | `/api/pagamento/gerar`         | Gera QR Code para pagamento via Mercado Pago |
| POST   | `/api/pagamento/notificar`     | Webhook para notificação de pagamento        |
| POST   | `/api/pagamento/fake-checkout` | Simula pagamento para demonstração           |
| GET    | `/health`                      | Health check                                 |

> Swagger disponível em `/pagamento-docs`.

---

## 🚀 Executando localmente

```bash
git clone https://github.com/seu-usuario/pagamento-service.git
cd pagamento-service
cp .env.example .env
# Preencha as variáveis como ACCESS_TOKEN do Mercado Pago etc.
docker-compose up --build
```

---

## 🛠️ Observações

- O QR Code é gerado usando o **Mercado Pago Checkout** com URLs de redirecionamento e webhook via **ngrok** (em modo demonstração).
- Autenticação via JWT (tokens Cognito).
- Todos os microsserviços se comunicam via API REST.
- Este serviço persiste pagamentos em **DynamoDB** com IAM Role configurado via Terraform.

---

## 🧪 Testes

- Casos de uso cobertos por testes unitários com Jest.
- Integração com SonarCloud garantindo **mínimo de 80% de coverage**.
- Testes em estilo BDD implementados para os principais fluxos.

---

## 🧩 Clean Architecture

Este serviço segue a Clean Architecture com as seguintes camadas:

- `domain/`: entidades e interfaces
- `usecases/`: regras de negócio
- `interfaces/http/`: controllers, rotas, middlewares
- `infrastructure/`: integração com serviços externos e repositórios
- `config/`: variáveis de ambiente e configurações gerais

---

## 📦 CI/CD

- Pipeline de build, push para ECR e deploy via GitHub Actions
- Provisionamento da infraestrutura via **Terraform**
- Deploy automático para ECS Fargate na AWS após o merge na `main`

---

## 📄 Licença

Projeto acadêmico para fins de demonstração.
