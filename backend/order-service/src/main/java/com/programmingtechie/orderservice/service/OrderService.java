package com.programmingtechie.orderservice.service;

import com.programmingtechie.orderservice.dto.OrderRequest;
import com.programmingtechie.orderservice.event.OrderPlacedEvent;
import com.programmingtechie.orderservice.model.Order;
import com.programmingtechie.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

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
}
