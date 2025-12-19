package com.easyToBuy.service;

import com.easyToBuy.dto.ProductRequest;
import com.easyToBuy.dto.ProductResponse;
import com.easyToBuy.model.Product;
import com.easyToBuy.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

        private final ProductRepository productRepository;

        public ProductResponse createProduct(ProductRequest productRequest) {
                Product product = Product.builder()
                                .name(productRequest.name())
                                .description(productRequest.description())
                                .price(productRequest.price())
                                .skuCode(productRequest.skuCode())
                                .brand(productRequest.brand())
                                .category(productRequest.category())
                                .images(productRequest.images())
                                .sizes(productRequest.sizes())
                                // Default rating for new products
                                .rating(4.5)
                                .build();

                productRepository.save(product);
                log.info("Product {} is saved", product.getId());
                return mapToProductResponse(product);
        }

        public List<ProductResponse> getAllProducts() {
                List<Product> products = productRepository.findAll();

                return products.stream().map(this::mapToProductResponse).toList();
        }

        public ProductResponse getProductById(String id) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

                log.info("Product {} retrieved", product.getId());
                return mapToProductResponse(product);
        }

        private ProductResponse mapToProductResponse(Product product) {
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
