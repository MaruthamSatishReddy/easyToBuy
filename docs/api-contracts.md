# API Contracts

## Product Service
- `GET /api/products`: List products
- `POST /api/products`: Create product
- `GET /api/products/{id}`: Get product details

## Order Service
- `POST /api/orders`: Place an order
    - Body: `{ "skuCode": "iphone_13", "price": 1200, "quantity": 1 }`

## Inventory Service
- `GET /api/inventory`: Check stock
- `GET /api/inventory/{skuCode}`: Get specific stock
