package com.kct.findx.service.impl;

import com.kct.findx.exception.BadRequestException;
import com.kct.findx.service.S3StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3StorageServiceImpl implements S3StorageService {

    private final S3Client s3Client;

    @Value("${app.aws.s3.bucket}")
    private String bucket;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            String key = "items/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return String.format("https://%s.s3.amazonaws.com/%s", bucket, key);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to upload file: " + ex.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        String key = fileUrl.substring(fileUrl.indexOf(".com/") + 5);
        s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
    }
}
