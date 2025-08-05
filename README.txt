curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "items": [
      {
        "id": "prod001",
        "name": "Notebook Dell Inspiron 15",
        "price": 2500.00,
        "quantity": 1
      }
    ],
    "status": "pending"
  }'