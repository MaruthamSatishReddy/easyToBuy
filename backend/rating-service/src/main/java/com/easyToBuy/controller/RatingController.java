package com.easyToBuy.controller;

import com.easyToBuy.dto.AverageRatingResponse;
import com.easyToBuy.dto.RatingRequest;
import com.easyToBuy.dto.RatingResponse;
import com.easyToBuy.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RatingResponse createRating(@Valid @RequestBody RatingRequest request) {
        return ratingService.createRating(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RatingResponse updateRating(
            @PathVariable String id,
            @Valid @RequestBody RatingRequest request) {
        return ratingService.updateRating(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRating(
            @PathVariable String id,
            @RequestParam String userId) {
        ratingService.deleteRating(id, userId);
    }

    @GetMapping("/product/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public List<RatingResponse> getRatingsByProduct(@PathVariable String productId) {
        return ratingService.getRatingsByProduct(productId);
    }

    @GetMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<RatingResponse> getRatingsByUser(@PathVariable String userId) {
        return ratingService.getRatingsByUser(userId);
    }

    @GetMapping("/product/{productId}/average")
    @ResponseStatus(HttpStatus.OK)
    public AverageRatingResponse getAverageRating(@PathVariable String productId) {
        return ratingService.getAverageRating(productId);
    }

    @PostMapping("/{id}/helpful")
    @ResponseStatus(HttpStatus.OK)
    public RatingResponse markHelpful(@PathVariable String id) {
        return ratingService.incrementHelpful(id);
    }
}
