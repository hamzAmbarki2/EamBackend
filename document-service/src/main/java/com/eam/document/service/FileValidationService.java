package com.eam.document.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@Service
public class FileValidationService {
	private final long maxSizeBytes;
	private final Set<String> allowedContentTypes;
	private final Set<String> allowedExtensions;

	public FileValidationService(
			@Value("${app.upload.max-file-size-bytes:10485760}") long maxSizeBytes,
			@Value("${app.upload.allowed-content-types:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/png,image/jpeg}") String allowedTypes,
			@Value("${app.upload.allowed-extensions:pdf,doc,docx,xls,xlsx,txt,png,jpg,jpeg}") String allowedExtensions
	) {
		this.maxSizeBytes = maxSizeBytes;
		this.allowedContentTypes = new HashSet<>(Arrays.asList(allowedTypes.split(",")));
		this.allowedExtensions = new HashSet<>();
		for (String ext : allowedExtensions.split(",")) {
			this.allowedExtensions.add(ext.trim().toLowerCase(Locale.ROOT));
		}
	}

	public void validate(MultipartFile file) {
		if (file.isEmpty()) {
			throw new IllegalArgumentException("Empty file is not allowed");
		}
		if (file.getSize() > maxSizeBytes) {
			throw new IllegalArgumentException("File too large. Max allowed: " + maxSizeBytes + " bytes");
		}
		String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
		if (!allowedContentTypes.contains(contentType)) {
			throw new IllegalArgumentException("Unsupported content type: " + contentType);
		}
		String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "";
		int dot = original.lastIndexOf('.');
		String ext = dot >= 0 ? original.substring(dot + 1).toLowerCase(Locale.ROOT) : "";
		if (!allowedExtensions.contains(ext)) {
			throw new IllegalArgumentException("Unsupported file extension: ." + ext);
		}
	}
}