package com.easyToBuy.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecommendationResponse {
    private List<ProductResponse> recommendedProducts;
    private String reason;
    private Double confidenceScore;
}
