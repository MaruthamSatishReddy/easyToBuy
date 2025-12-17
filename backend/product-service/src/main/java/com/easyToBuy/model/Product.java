package com.easyToBuy.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.util.List;
import java.math.BigDecimal;

@Document(collection = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
    @Id
    private String id;
    private String skuCode;
    private String name;
    private String description;
    private BigDecimal price;
    private String brand;
    private String category;
    private Double rating;

    private List<String> images;

    private List<String> sizes;
}
