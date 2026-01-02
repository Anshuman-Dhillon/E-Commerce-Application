package com.ecommerceapp.backend.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class StorageService {
    
    private S3Client s3Client;
    
    @Value("${aws.s3.bucket-name}")
    private String bucketName;
    
    @Value("${aws.s3.region}")
    private String region;
    
    @Value("${aws.s3.access-key}")
    private String accessKey;
    
    @Value("${aws.s3.secret-key}")
    private String secretKey;

    private S3Client getS3Client() {
        if (s3Client == null) {
            AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);
            s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                    .build();
        }
        return s3Client;
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : "";
        String key = folder + "/" + UUID.randomUUID().toString() + extension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            getS3Client().putObject(putObjectRequest, 
                    RequestBody.fromBytes(file.getBytes()));

            // Return public URL
            String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", 
                    bucketName, region, key);
            
            System.out.println("✓ File uploaded to S3: " + fileUrl);
            return fileUrl;
            
        } catch (Exception e) {
            System.err.println("S3 upload failed: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to upload file to S3: " + e.getMessage());
        }
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl != null && fileUrl.startsWith("http") && fileUrl.contains(".s3.")) {
            try {
                // Extract the key from the URL
                String key = fileUrl.substring(fileUrl.indexOf(".com/") + 5);
                
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                
                getS3Client().deleteObject(deleteObjectRequest);
                System.out.println("✓ File deleted from S3: " + key);
                
            } catch (Exception e) {
                System.err.println("Failed to delete file from S3: " + e.getMessage());
            }
        }
    }
}