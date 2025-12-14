package com.programmingtechie.productservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

public record ProductResponse(Long id, String skuCode, String name, String description, BigDecimal price,
        String brand, String category, Double rating, List<String> images, List<String> sizes) {
}
