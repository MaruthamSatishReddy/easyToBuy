package com.easyToBuy.dto;

import java.math.BigDecimal;

/**
 * Order Response DTO
 */
public record OrderResponse(String id, String orderNumber, String skuCode, BigDecimal price, Integer quantity,
        String email) {
}
