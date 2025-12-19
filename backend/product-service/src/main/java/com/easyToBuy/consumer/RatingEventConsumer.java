package com.easyToBuy.consumer;

import com.easyToBuy.model.Product;
import com.easyToBuy.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class RatingEventConsumer {

    private final ProductRepository productRepository;

    @KafkaListener(topics = "rating-events", groupId = "product-service")
    public void consumeRatingEvent(Map<String, Object> event) {
        try {
            String productId = (String) event.get("productId");
            Object avgRatingObj = event.get("averageRating");

            if (productId == null || avgRatingObj == null) {
                log.warn("Received rating event with missing data: {}", event);
                return;
            }

            Double averageRating = avgRatingObj instanceof Number
                    ? ((Number) avgRatingObj).doubleValue()
                    : Double.parseDouble(avgRatingObj.toString());

            log.info("Received rating event for product: {} with average rating: {}",
                    productId, averageRating);

            productRepository.findById(productId).ifPresent(product -> {
                product.setRating(averageRating);
                productRepository.save(product);
                log.info("Updated product {} rating to {}", productId, averageRating);
            });

        } catch (Exception e) {
            log.error("Error processing rating event: {}", event, e);
        }
    }
}
