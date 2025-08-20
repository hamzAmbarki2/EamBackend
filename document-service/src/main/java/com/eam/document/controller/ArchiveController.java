package com.eam.document.controller;

import com.eam.common.security.RoleAllowed;
import com.eam.document.entity.Archive;
import com.eam.document.enums.TypeArchive;
import com.eam.document.service.FileValidationService;
import com.eam.document.service.IDocumentService;
import com.eam.document.service.VirusScanService;
import com.eam.document.web.ArchiveStats;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/archives")
public class ArchiveController {

	private final IDocumentService documentService;
	private final FileValidationService fileValidationService;
	private final VirusScanService virusScanService;

	public ArchiveController(IDocumentService documentService,
	                        FileValidationService fileValidationService,
	                        VirusScanService virusScanService) {
		this.documentService = documentService;
		this.fileValidationService = fileValidationService;
		this.virusScanService = virusScanService;
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@PostMapping("/upload")
	public ResponseEntity<Archive> upload(
			@RequestParam("file") MultipartFile file,
			@RequestParam("type") TypeArchive type,
			@RequestParam(value = "linkedEntityType", required = false) String linkedEntityType,
			@RequestParam(value = "linkedEntityId", required = false) Long linkedEntityId
	) throws IOException {
		fileValidationService.validate(file);
		virusScanService.scanOrThrow(file);
		Archive saved = documentService.store(file, type, linkedEntityType, linkedEntityId);
		return ResponseEntity.ok(saved);
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@GetMapping
	public List<Archive> listAll() {
		return documentService.findAll();
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@GetMapping("/type/{type}")
	public List<Archive> listByType(@PathVariable TypeArchive type) {
		return documentService.findByType(type);
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@GetMapping("/linked")
	public List<Archive> listByLinked(
			@RequestParam("entityType") String entityType,
			@RequestParam("entityId") Long entityId
	) {
		return documentService.findByLinkedEntity(entityType, entityId);
	}

	@RoleAllowed({"ADMIN", "CHEFTECH"})
	@GetMapping("/statistics")
	public ArchiveStats statistics() {
		List<Archive> all = documentService.findAll();
		long totalCount = all.size();
		long totalBytes = all.stream().mapToLong(Archive::getSizeBytes).sum();
		Map<TypeArchive, Long> byType = all.stream().collect(Collectors.groupingBy(Archive::getType, Collectors.counting()));
		return new ArchiveStats(totalCount, totalBytes, byType);
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@GetMapping("/{id}")
	public ResponseEntity<Archive> getById(@PathVariable Long id) {
		Optional<Archive> archive = documentService.findById(id);
		return archive.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@GetMapping("/{id}/download")
	public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
		Archive archive = documentService.findById(id).orElseThrow(() -> new IOException("Archive not found"));
		Resource resource = documentService.loadAsResource(id);
		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(archive.getContentType()))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + archive.getOriginalFilename() + "\"")
				.body(resource);
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP"})
	@PutMapping("/{id}")
	public ResponseEntity<Archive> updateMetadata(
			@PathVariable Long id,
			@RequestParam(value = "originalFilename", required = false) String originalFilename,
			@RequestParam(value = "type", required = false) TypeArchive type,
			@RequestParam(value = "linkedEntityType", required = false) String linkedEntityType,
			@RequestParam(value = "linkedEntityId", required = false) Long linkedEntityId
	) {
		Archive updated = documentService.updateMetadata(id, originalFilename, type, linkedEntityType, linkedEntityId);
		return ResponseEntity.ok(updated);
	}

	@RoleAllowed({"ADMIN", "CHEFTECH"})
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
		documentService.delete(id);
		return ResponseEntity.noContent().build();
	}
}