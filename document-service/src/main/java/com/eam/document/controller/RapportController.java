package com.eam.document.controller;

import com.eam.common.security.RoleAllowed;
import com.eam.document.entity.Rapport;
import com.eam.document.service.RapportService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/rapports")
public class RapportController {

	private final RapportService rapportService;

	public RapportController(RapportService rapportService) {
		this.rapportService = rapportService;
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@PostMapping("/generate")
	public ResponseEntity<Rapport> generate(
			@RequestParam("interventionId") Long interventionId,
			@RequestParam("titre") String titre,
			@RequestParam(value = "description", required = false) String description,
			@RequestParam("file") MultipartFile file) throws IOException {
		Rapport saved = rapportService.createRapport(interventionId, titre, description, file);
		return ResponseEntity.ok(saved);
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@GetMapping
	public List<Rapport> listAll() {
		return rapportService.listAll();
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@GetMapping("/intervention/{interventionId}")
	public List<Rapport> listByIntervention(@PathVariable Long interventionId) {
		return rapportService.listByIntervention(interventionId);
	}

	@RoleAllowed({"ADMIN", "CHEFTECH", "CHETOP", "TECHNICIEN"})
	@GetMapping("/{id}/download")
	public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
		Resource resource = rapportService.downloadRapport(id);
		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"rapport_" + id + "\"")
				.body(resource);
	}
}
