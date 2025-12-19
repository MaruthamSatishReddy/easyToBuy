package com.easyToBuy.controller;

import com.easyToBuy.dto.ProductResponse;
import com.easyToBuy.dto.RecommendationResponse;
import com.easyToBuy.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/recommendations/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public RecommendationResponse getRecommendations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        return recommendationService.getPersonalizedRecommendations(userId, limit);
    }

    @GetMapping("/{productId}/similar")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getSimilarProducts(
            @PathVariable String productId,
            @RequestParam(defaultValue = "5") int limit) {
        return recommendationService.getSimilarProducts(productId, limit);
    }

    @GetMapping("/trending")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getTrendingProducts(
            @RequestParam(defaultValue = "10") int limit) {
        return recommendationService.getTrendingProducts(limit);
    }

    @GetMapping("/{productId}/ai-description")
    @ResponseStatus(HttpStatus.OK)
    public String getAIDescription(@PathVariable String productId) {
        return recommendationService.getAIProductDescription(productId);
    }
}
