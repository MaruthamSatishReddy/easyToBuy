package com.easyToBuy.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(String skuCode, String name, String description, BigDecimal price, String brand,
        String category, List<String> images, List<String> sizes) {
}
