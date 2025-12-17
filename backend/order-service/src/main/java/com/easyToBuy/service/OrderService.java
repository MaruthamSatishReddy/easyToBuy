package com.easyToBuy.service;

import com.easyToBuy.dto.OrderRequest;
import com.easyToBuy.dto.OrderResponse;
import com.easyToBuy.event.OrderPlacedEvent;
import com.easyToBuy.model.Order;
import com.easyToBuy.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    public void placeOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setPrice(orderRequest.price());
        order.setSkuCode(orderRequest.skuCode());
        order.setQuantity(orderRequest.quantity());
        order.setEmail(orderRequest.email());

        orderRepository.save(order);
        log.info("Order Placed Successfully");

        OrderPlacedEvent orderPlacedEvent = new OrderPlacedEvent();
        orderPlacedEvent.setOrderNumber(order.getOrderNumber());
        orderPlacedEvent.setEmail(orderRequest.email());
        orderPlacedEvent.setSkuCode(orderRequest.skuCode());
        orderPlacedEvent.setPrice(orderRequest.price());
        orderPlacedEvent.setQuantity(orderRequest.quantity());

        log.info("Start - Sending OrderPlacedEvent {} to Kafka topic order-topic", orderPlacedEvent);
        kafkaTemplate.send("order-topic", orderPlacedEvent);
        log.info("End - Sending OrderPlacedEvent {} to Kafka topic order-topic", orderPlacedEvent);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> new OrderResponse(
                        order.getId(),
                        order.getOrderNumber(),
                        order.getSkuCode(),
                        order.getPrice(),
                        order.getQuantity(),
                        order.getEmail()))
                .toList();
    }
}
