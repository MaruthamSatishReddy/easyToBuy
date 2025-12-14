# Kafka Event Flow

1. **Topic**: `order-topic`

2. **Producer**: `OrderService`
   - Event: `OrderCreatedEvent`
   - Payload: `OrderNumber`, `SkuCode`, `Price`, `Quantity`, `Email`

3. **Consumers**:
   - `InventoryService`: Deducts quantity.
   - `NotificationService`: Sends confirmation email to `Email`.
