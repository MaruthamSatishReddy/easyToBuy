package com.easyToBuy.repository;

import com.easyToBuy.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {

    List<Rating> findByProductId(String productId);

    List<Rating> findByProductIdOrderByCreatedAtDesc(String productId);

    List<Rating> findByUserId(String userId);

    Optional<Rating> findByProductIdAndUserId(String productId, String userId);

    Long countByProductId(String productId);

    Long countByProductIdAndRating(String productId, Integer rating);
}
