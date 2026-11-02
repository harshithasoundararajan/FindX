package com.kct.findx.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3StorageService {
    String uploadFile(MultipartFile file);
    void deleteFile(String fileUrl);
}
