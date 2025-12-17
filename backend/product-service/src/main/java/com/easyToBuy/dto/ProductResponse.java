package com.easyToBuy.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Product Response DTO
 */
public record ProductResponse(String id, String skuCode, String name, String description, BigDecimal price,
                String brand, String category, Double rating, List<String> images, List<String> sizes) {
}
