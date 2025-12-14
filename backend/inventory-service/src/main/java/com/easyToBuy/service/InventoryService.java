package com.programmingtechie.inventoryservice.service;

import com.programmingtechie.inventoryservice.event.OrderPlacedEvent;
import com.programmingtechie.inventoryservice.model.Inventory;
import com.programmingtechie.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @KafkaListener(topics = "order-topic", groupId = "inventory-group")
    public void handleOrderPlaced(OrderPlacedEvent event) {
        log.info("Received Order Placed Event: {}", event);
        Inventory inventory = inventoryRepository.findBySkuCode(event.getSkuCode())
                .orElseThrow(() -> new RuntimeException("Cannot find Product by skuCode " + event.getSkuCode()));

        inventory.setQuantity(inventory.getQuantity() - event.getQuantity());
        inventoryRepository.save(inventory);
        log.info("Stock updated for skuCode: {}", event.getSkuCode());
    }
}
