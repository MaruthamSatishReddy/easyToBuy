# Architecture Overview

## Systems

### 1. Product Service
- **Port**: 8081
- **DB**: Postgres (db: product_db)
- **Functions**: Manage products, prices, stock availability (read-only mirror or direct check).

### 2. Order Service
- **Port**: 8082
- **DB**: Postgres (db: order_db)
- **Functions**: Create orders. Publishes `OrderCreatedEvent` to Kafka.

### 3. Inventory Service
- **Port**: 8083
- **DB**: Postgres (db: inventory_db)
- **Functions**: Tracks stock. Consumes `OrderCreatedEvent` to decrement stock.

### 4. Notification Service
- **Port**: 8084
- **Functions**: Consumes `OrderCreatedEvent` to send emails (simulated).

### 5. Frontend
- **Port**: 3000 (Local)
- **Tech**: React, Vite
- **Functions**: User interface for browsing products and placing orders.

## Infrastructure
- **Kafka**: Event bus for async communication.
- **PostgreSQL**: Database per service (schema isolation).
- **Docker Compose**: Orchestration.
