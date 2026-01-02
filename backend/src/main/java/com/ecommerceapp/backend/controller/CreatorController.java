package com.ecommerceapp.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerceapp.backend.model.Customer;
import com.ecommerceapp.backend.model.Product;
import com.ecommerceapp.backend.model.Supplier;
import com.ecommerceapp.backend.repository.CustomerRepository;
import com.ecommerceapp.backend.repository.ProductRepository;
import com.ecommerceapp.backend.repository.SupplierRepository;
import com.ecommerceapp.backend.service.StorageService;

@RestController
@RequestMapping("/api/creators")
@CrossOrigin(origins = "http://localhost:3000")
public class CreatorController {
    
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final StorageService storageService;
    private final SupplierRepository supplierRepository;

    public CreatorController(ProductRepository productRepository, CustomerRepository customerRepository, StorageService storageService, SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.storageService = storageService;
        this.supplierRepository = supplierRepository;
    }

    @GetMapping("/{creatorId}/products")
    public ResponseEntity<?> getCreatorProducts(@PathVariable Long creatorId) {
        List<Product> products = productRepository.findByCreatorId(creatorId);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/{creatorId}/products")
    public ResponseEntity<?> createProduct(@PathVariable Long creatorId, @RequestBody ProductUploadRequest request) {
        Optional<Customer> creator = customerRepository.findById(creatorId);
        if (!creator.isPresent() || !"CREATOR".equals(creator.get().getUserRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only creators can upload products");
        }

        Product product = new Product();
        
        Long nextId = productRepository.findTopByOrderByProductIdDesc()
            .map(p -> p.getProductId() + 1)
            .orElse(1L);
        
        product.setProductId(nextId);
        product.setProductName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategoryId(request.getCategoryId());

        // choose a supplier based on category when possible, otherwise pick a random supplier
        List<Supplier> suppliers = supplierRepository.findAll();
        if (suppliers == null || suppliers.isEmpty()) {
            product.setSupplierId(null);
        } else {
            Long chosenSupplierId = null;
            if (request.getCategoryId() != null) {
                // map category to a supplier deterministically using modulus to stay within bounds
                int idx = (int) ((request.getCategoryId() - 1) % suppliers.size());
                if (idx < 0) idx = 0;
                chosenSupplierId = suppliers.get(idx).getSupplierId();
            } else {
                chosenSupplierId = suppliers.get(new Random().nextInt(suppliers.size())).getSupplierId();
            }
            product.setSupplierId(chosenSupplierId);
        }
        product.setCreatorId(creatorId);
        product.setModelUrl(request.getModelUrl());
        product.setThumbnailUrl(request.getThumbnailUrl());
        
        Product saved = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/{creatorId}/upload-model")
    public ResponseEntity<?> uploadModel(
            @PathVariable Long creatorId,
            @RequestParam("file") MultipartFile file) {
        
        try {
            Optional<Customer> creator = customerRepository.findById(creatorId);
            if (!creator.isPresent() || !"CREATOR".equals(creator.get().getUserRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only creators can upload models");
            }

            String fileUrl = storageService.uploadFile(file, "models");
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("message", "File uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Upload failed: " + e.getMessage());
        }
    }

    @PostMapping("/{creatorId}/upload-thumbnail")
    public ResponseEntity<?> uploadThumbnail(
            @PathVariable Long creatorId,
            @RequestParam("file") MultipartFile file) {
        
        try {
            Optional<Customer> creator = customerRepository.findById(creatorId);
            if (!creator.isPresent() || !"CREATOR".equals(creator.get().getUserRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only creators can upload thumbnails");
            }

            String fileUrl = storageService.uploadFile(file, "thumbnails");
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("message", "Thumbnail uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Upload failed: " + e.getMessage());
        }
    }

    public static class ProductUploadRequest {
        private String name;
        private String description;
        private Double price;
        private Integer stock;
        private Long categoryId;
        private String modelUrl;
        private String thumbnailUrl;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public Integer getStock() { return stock; }
        public void setStock(Integer stock) { this.stock = stock; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getModelUrl() { return modelUrl; }
        public void setModelUrl(String modelUrl) { this.modelUrl = modelUrl; }
        public String getThumbnailUrl() { return thumbnailUrl; }
        public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    }
}