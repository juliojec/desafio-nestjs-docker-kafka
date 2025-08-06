# Desafio NestJS - Microserviços

Este repositório contém uma arquitetura de microserviços utilizando [NestJS](https://nestjs.com/), Docker, Kafka e outros recursos modernos para backend. O objetivo é demonstrar a integração entre múltiplos serviços, comunicação assíncrona e boas práticas de desenvolvimento.

## Estrutura do Projeto

```
apps/
  bff-service/           # Backend For Frontend (API Gateway)
  expedition-service/    # Serviço de expedições
  orders-service/        # Serviço de pedidos
  payments-service/      # Serviço de pagamentos
libs/
  kafka/                 # Biblioteca compartilhada para integração com Kafka
  shared-models/         # Modelos e DTOs compartilhados entre os serviços
scripts/                 # Scripts de banco de dados e utilitários
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 16.x
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Kafka](https://kafka.apache.org/) (gerenciado via Docker)

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/juliojec/desafio-nestjs-docker-kafka
   cd desafio-nestjs-docker-kafka
   ```

3. **Suba os serviços com Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Endereço Swagger:**
   ```bash
   http://localhost:3000/bff/docs
   ```

5. **Acesse os serviços:**

## Rotas do BFF

O serviço BFF expõe as seguintes rotas para orquestração e consulta de pedidos, pagamentos e expedições:

| Método | Rota                              | Descrição                                                                                 |
|--------|-----------------------------------|-------------------------------------------------------------------------------------------|
| POST   | `/orders`                         | Cria um novo pedido. Recebe um JSON com os dados do pedido.                               |
| GET    | `/orders`                         | Lista todos os pedidos.                                                                   |
| GET    | `/orders/:orderId`                | Busca um pedido específico pelo ID.                                                       |
| GET    | `/orders/payment/:orderId`        | Busca o pagamento relacionado a um pedido específico.                                     |
| GET    | `/orders/expedition/:orderId`     | Busca a expedição relacionada a um pedido específico.                                     |

### Exemplos de uso

#### Criar pedido

```
POST /orders
Body:
{
  "id": "a9651129-777a-4a4c-ac6d-ed06186d47d9",
  "userId": "user-98765",
  "items": [
    {
      "id": "item-1",
      "name": "Camisa Corinthians",
      "price": 199.90,
      "quantity": 2
    },
    {
      "id": "item-2",
      "name": "Boné Gaviões",
      "price": 79.90,
      "quantity": 1
    }
  ],
  "status": "processing"
}
```

## Documentação

- [NestJS](https://docs.nestjs.com/)
- [KafkaJS](https://kafka.js.org/)
- [Docker Compose](https://docs.docker.com/compose/)
