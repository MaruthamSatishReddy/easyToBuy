package com.easyToBuy.event;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RatingEvent {
    private String productId;
    private Double averageRating;
    private Long totalRatings;
    private String eventType; // CREATED, UPDATED, DELETED
}
