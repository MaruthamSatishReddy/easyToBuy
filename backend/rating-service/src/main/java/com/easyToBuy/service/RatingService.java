package com.easyToBuy.service;

import com.easyToBuy.dto.AverageRatingResponse;
import com.easyToBuy.dto.RatingRequest;
import com.easyToBuy.dto.RatingResponse;
import com.easyToBuy.event.RatingEvent;
import com.easyToBuy.model.Rating;
import com.easyToBuy.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {

    private final RatingRepository ratingRepository;
    private final KafkaTemplate<String, RatingEvent> kafkaTemplate;

    public RatingResponse createRating(RatingRequest request) {
        // Check if user already rated this product
        var existingRating = ratingRepository.findByProductIdAndUserId(
                request.getProductId(),
                request.getUserId());

        if (existingRating.isPresent()) {
            throw new RuntimeException("User has already rated this product. Use update instead.");
        }

        Rating rating = Rating.builder()
                .productId(request.getProductId())
                .userId(request.getUserId())
                .userName(request.getUserName())
                .rating(request.getRating())
                .comment(request.getComment())
                .helpfulCount(0)
                .createdAt(LocalDateTime.now())
                .build();

        Rating savedRating = ratingRepository.save(rating);
        log.info("Created rating with id: {}", savedRating.getId());

        // Publish event
        publishRatingEvent(request.getProductId(), "CREATED");

        return mapToResponse(savedRating);
    }

    public RatingResponse updateRating(String id, RatingRequest request) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found with id: " + id));

        // Verify user owns this rating
        if (!rating.getUserId().equals(request.getUserId())) {
            throw new RuntimeException("User can only update their own ratings");
        }

        rating.setRating(request.getRating());
        rating.setComment(request.getComment());
        rating.setUpdatedAt(LocalDateTime.now());

        Rating updatedRating = ratingRepository.save(rating);
        log.info("Updated rating with id: {}", updatedRating.getId());

        // Publish event
        publishRatingEvent(rating.getProductId(), "UPDATED");

        return mapToResponse(updatedRating);
    }

    public void deleteRating(String id, String userId) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found with id: " + id));

        // Verify user owns this rating
        if (!rating.getUserId().equals(userId)) {
            throw new RuntimeException("User can only delete their own ratings");
        }

        String productId = rating.getProductId();
        ratingRepository.deleteById(id);
        log.info("Deleted rating with id: {}", id);

        // Publish event
        publishRatingEvent(productId, "DELETED");
    }

    public List<RatingResponse> getRatingsByProduct(String productId) {
        return ratingRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RatingResponse> getRatingsByUser(String userId) {
        return ratingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AverageRatingResponse getAverageRating(String productId) {
        List<Rating> ratings = ratingRepository.findByProductId(productId);

        if (ratings.isEmpty()) {
            return AverageRatingResponse.builder()
                    .productId(productId)
                    .averageRating(0.0)
                    .totalRatings(0L)
                    .fiveStarCount(0L)
                    .fourStarCount(0L)
                    .threeStarCount(0L)
                    .twoStarCount(0L)
                    .oneStarCount(0L)
                    .build();
        }

        double average = ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);

        return AverageRatingResponse.builder()
                .productId(productId)
                .averageRating(Math.round(average * 10.0) / 10.0)
                .totalRatings((long) ratings.size())
                .fiveStarCount(ratingRepository.countByProductIdAndRating(productId, 5))
                .fourStarCount(ratingRepository.countByProductIdAndRating(productId, 4))
                .threeStarCount(ratingRepository.countByProductIdAndRating(productId, 3))
                .twoStarCount(ratingRepository.countByProductIdAndRating(productId, 2))
                .oneStarCount(ratingRepository.countByProductIdAndRating(productId, 1))
                .build();
    }

    public RatingResponse incrementHelpful(String id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found with id: " + id));

        rating.setHelpfulCount(rating.getHelpfulCount() + 1);
        Rating updatedRating = ratingRepository.save(rating);

        return mapToResponse(updatedRating);
    }

    private void publishRatingEvent(String productId, String eventType) {
        try {
            AverageRatingResponse avgRating = getAverageRating(productId);

            RatingEvent event = RatingEvent.builder()
                    .productId(productId)
                    .averageRating(avgRating.getAverageRating())
                    .totalRatings(avgRating.getTotalRatings())
                    .eventType(eventType)
                    .build();

            kafkaTemplate.send("rating-events", event);
            log.info("Published rating event for product: {}", productId);
        } catch (Exception e) {
            log.error("Failed to publish rating event", e);
        }
    }

    private RatingResponse mapToResponse(Rating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .productId(rating.getProductId())
                .userId(rating.getUserId())
                .userName(rating.getUserName())
                .rating(rating.getRating())
                .comment(rating.getComment())
                .helpfulCount(rating.getHelpfulCount())
                .createdAt(rating.getCreatedAt())
                .updatedAt(rating.getUpdatedAt())
                .build();
    }
}
