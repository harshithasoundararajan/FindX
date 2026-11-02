package com.kct.findx.controller;

import com.kct.findx.dto.response.ApiResponse;
import com.kct.findx.service.S3StorageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "Image upload to Amazon S3")
public class FileUploadController {

    private final S3StorageService s3StorageService;

    @PostMapping("/upload")
    public ApiResponse<String> upload(@RequestParam("file") MultipartFile file) {
        return ApiResponse.success("File uploaded successfully", s3StorageService.uploadFile(file));
    }
}
