package com.easyToBuy.dto;

import java.math.BigDecimal;

public record OrderRequest(String skuCode, BigDecimal price, Integer quantity, String email) {
}
