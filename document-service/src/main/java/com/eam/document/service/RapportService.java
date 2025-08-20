package com.eam.document.service;

import com.eam.document.entity.Archive;
import com.eam.document.entity.Rapport;
import com.eam.document.enums.TypeArchive;
import com.eam.document.repository.RapportRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
public class RapportService {
	private final RapportRepository rapportRepository;
	private final IDocumentService documentService;

	public RapportService(RapportRepository rapportRepository, IDocumentService documentService) {
		this.rapportRepository = rapportRepository;
		this.documentService = documentService;
	}

	public Rapport createRapport(Long interventionId, String titre, String description, MultipartFile file) throws IOException {
		Archive archive = documentService.store(file, TypeArchive.DOCUMENT, "INTERVENTION", interventionId);
		Rapport rapport = Rapport.builder()
				.interventionId(interventionId)
				.titre(titre)
				.description(description)
				.archive(archive)
				.build();
		return rapportRepository.save(rapport);
	}

	public Resource downloadRapport(Long rapportId) throws IOException {
		Rapport rapport = rapportRepository.findById(rapportId)
				.orElseThrow(() -> new IOException("Rapport not found: " + rapportId));
		return documentService.loadAsResource(rapport.getArchive().getId());
	}

	public List<Rapport> listAll() {
		return rapportRepository.findAll();
	}

	public List<Rapport> listByIntervention(Long interventionId) {
		return rapportRepository.findByInterventionId(interventionId);
	}
}
