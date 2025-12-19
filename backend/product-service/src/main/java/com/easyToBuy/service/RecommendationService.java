package com.easyToBuy.service;

import com.easyToBuy.dto.ProductResponse;
import com.easyToBuy.dto.RecommendationResponse;
import com.easyToBuy.model.Product;
import com.easyToBuy.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final ProductRepository productRepository;
    private final ChatModel chatModel;

    @Cacheable(value = "recommendations", key = "#userId")
    public RecommendationResponse getPersonalizedRecommendations(String userId, int limit) {
        log.info("Generating personalized recommendations for user: {}", userId);

        // Get all products
        List<Product> allProducts = productRepository.findAll();

        if (allProducts.isEmpty()) {
            return RecommendationResponse.builder()
                    .recommendedProducts(Collections.emptyList())
                    .reason("No products available")
                    .confidenceScore(0.0)
                    .build();
        }

        // For now, use a simple algorithm: recommend highly-rated products
        // In a real scenario, you'd use user purchase history, browsing behavior, etc.
        List<Product> topRatedProducts = allProducts.stream()
                .filter(p -> p.getRating() != null && p.getRating() >= 4.0)
                .sorted((p1, p2) -> Double.compare(
                        p2.getRating() != null ? p2.getRating() : 0.0,
                        p1.getRating() != null ? p1.getRating() : 0.0))
                .limit(limit)
                .collect(Collectors.toList());

        if (topRatedProducts.isEmpty()) {
            // If no highly rated products, just return random products
            Collections.shuffle(allProducts);
            topRatedProducts = allProducts.stream().limit(limit).collect(Collectors.toList());
        }

        List<ProductResponse> recommendations = topRatedProducts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return RecommendationResponse.builder()
                .recommendedProducts(recommendations)
                .reason("Based on top-rated products and your preferences")
                .confidenceScore(0.85)
                .build();
    }

    @Cacheable(value = "similar-products", key = "#productId")
    public List<ProductResponse> getSimilarProducts(String productId, int limit) {
        log.info("Finding similar products for: {}", productId);

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return Collections.emptyList();
        }

        Product product = productOpt.get();

        // Find products in the same category
        List<Product> similarProducts = productRepository.findAll().stream()
                .filter(p -> !p.getId().equals(productId))
                .filter(p -> p.getCategory() != null && p.getCategory().equals(product.getCategory()))
                .limit(limit)
                .collect(Collectors.toList());

        // If not enough in same category, add products from same brand
        if (similarProducts.size() < limit && product.getBrand() != null) {
            List<Product> brandProducts = productRepository.findAll().stream()
                    .filter(p -> !p.getId().equals(productId))
                    .filter(p -> !similarProducts.contains(p))
                    .filter(p -> p.getBrand() != null && p.getBrand().equals(product.getBrand()))
                    .limit(limit - similarProducts.size())
                    .collect(Collectors.toList());
            similarProducts.addAll(brandProducts);
        }

        return similarProducts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getTrendingProducts(int limit) {
        log.info("Getting trending products");

        // Get products sorted by rating
        List<Product> trendingProducts = productRepository.findAll().stream()
                .filter(p -> p.getRating() != null && p.getRating() >= 3.5)
                .sorted((p1, p2) -> {
                    double rating1 = p1.getRating() != null ? p1.getRating() : 0.0;
                    double rating2 = p2.getRating() != null ? p2.getRating() : 0.0;
                    return Double.compare(rating2, rating1);
                })
                .limit(limit)
                .collect(Collectors.toList());

        return trendingProducts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public String getAIProductDescription(String productId) {
        log.info("Generating AI description for product: {}", productId);

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return "Product not found";
        }

        Product product = productOpt.get();

        String promptText = String.format("""
                Generate a compelling, SEO-optimized product description for the following product:

                Name: %s
                Category: %s
                Brand: %s
                Current Description: %s
                Price: $%s
                Rating: %s/5

                Create a 2-3 sentence description that highlights the key features and benefits.
                Make it engaging and persuasive for potential customers.
                """,
                product.getName(),
                product.getCategory() != null ? product.getCategory() : "General",
                product.getBrand() != null ? product.getBrand() : "Unknown",
                product.getDescription() != null ? product.getDescription() : "No description",
                product.getPrice(),
                product.getRating() != null ? product.getRating() : "N/A");

        try {
            Prompt prompt = new Prompt(promptText);
            String aiDescription = chatModel.call(prompt).getResult().getOutput().getText();
            log.info("Generated AI description: {}", aiDescription);
            return aiDescription;
        } catch (Exception e) {
            log.error("Error generating AI description", e);
            return product.getDescription();
        }
    }

    private ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSkuCode(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getBrand(),
                product.getCategory(),
                product.getRating(),
                product.getImages(),
                product.getSizes());
    }
}
