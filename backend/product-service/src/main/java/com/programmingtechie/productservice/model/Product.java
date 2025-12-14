package com.programmingtechie.productservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Table(name = "t_products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String skuCode;
    private String name;
    private String description;
    private BigDecimal price;
    private String brand;
    private String category;
    private Double rating;

    @ElementCollection
    private List<String> images;

    @ElementCollection
    private List<String> sizes;
}
