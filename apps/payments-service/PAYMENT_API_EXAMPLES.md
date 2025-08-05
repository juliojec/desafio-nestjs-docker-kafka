# Payment Service API Examples

## Endpoints Disponíveis

### 1. Buscar Pagamento por ID
```http
GET /payments/:id
```

**Exemplo:**
```bash
curl -X GET http://localhost:3003/payments/123e4567-e89b-12d3-a456-426614174000
```

**Resposta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "orderId": "order-123",
  "userId": "user-456",
  "status": "payment_requested",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

### 2. Atualizar Status do Pagamento
```http
PATCH /payments/:id/status
```

**Exemplo:**
```bash
curl -X PATCH http://localhost:3003/payments/123e4567-e89b-12d3-a456-426614174000/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid"
  }'
```

**Status Disponíveis:**
- `payment_requested` - Pagamento solicitado
- `paid` - Pago
- `canceled` - Cancelado

**Resposta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "orderId": "order-123",
  "userId": "user-456",
  "status": "paid",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:05:00.000Z"
}
```

## Códigos de Erro

- `404 Not Found` - Pagamento não encontrado
- `400 Bad Request` - Status inválido ou dados malformados
- `500 Internal Server Error` - Erro interno do servidor

## Validação

O endpoint de atualização de status valida automaticamente:
- Se o status fornecido é um dos valores permitidos (`payment_requested`, `paid`, `canceled`)
- Se o ID do pagamento existe no sistema 