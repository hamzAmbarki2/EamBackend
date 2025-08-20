package com.eam.document.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VirusScanService {
	public void scanOrThrow(MultipartFile file) {
		// Placeholder for AV integration (e.g., ClamAV via TCP). For now, do nothing.
	}
}