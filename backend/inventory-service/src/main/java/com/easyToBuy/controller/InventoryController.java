package com.easyToBuy.controller;

import com.easyToBuy.model.Inventory;
import com.easyToBuy.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin("*")
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    @GetMapping("/{skuCode}")
    @ResponseStatus(HttpStatus.OK)
    public Integer isInStock(@PathVariable String skuCode) {
        return inventoryRepository.findBySkuCode(skuCode)
                .map(Inventory::getQuantity)
                .orElseThrow(() -> new RuntimeException("Inventory not found for " + skuCode));
    }
}
