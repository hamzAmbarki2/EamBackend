package com.eam.document.service;

import com.eam.document.entity.Archive;
import com.eam.document.enums.TypeArchive;
import com.eam.document.repository.ArchiveRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ArchiveService implements IDocumentService {

	private final ArchiveRepository archiveRepository;
	private final Path storageRoot;

	public ArchiveService(ArchiveRepository archiveRepository,
	                     @Value("${app.upload.dir:./uploads}") String uploadDir) throws IOException {
		this.archiveRepository = archiveRepository;
		this.storageRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
		Files.createDirectories(this.storageRoot);
	}

	@Override
	public Archive store(MultipartFile file, TypeArchive type, String linkedEntityType, Long linkedEntityId) throws IOException {
		String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
		String safeFilename = UUID.randomUUID() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
		Path targetPath = storageRoot.resolve(safeFilename).normalize();
		Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
		Archive archive = Archive.builder()
				.filename(safeFilename)
				.originalFilename(originalFilename)
				.contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
				.sizeBytes(file.getSize())
				.storagePath(targetPath.toString())
				.type(type)
				.version(1)
				.linkedEntityType(linkedEntityType)
				.linkedEntityId(linkedEntityId)
				.build();
		try {
			archive.setChecksumSha256(computeSha256(targetPath));
		} catch (NoSuchAlgorithmException e) {
			// ignore if algorithm not found
		}
		return archiveRepository.save(archive);
	}

	@Override
	@Transactional(readOnly = true)
	public Resource loadAsResource(Long archiveId) throws IOException {
		Archive archive = archiveRepository.findById(archiveId)
				.orElseThrow(() -> new IOException("Archive not found: " + archiveId));
		Path path = Paths.get(archive.getStoragePath());
		if (!Files.exists(path)) {
			throw new IOException("File not found on disk: " + archive.getStoragePath());
		}
		return new FileSystemResource(path);
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<Archive> findById(Long id) {
		return archiveRepository.findById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Archive> findAll() {
		return archiveRepository.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Archive> findByType(TypeArchive type) {
		return archiveRepository.findByType(type);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Archive> findByLinkedEntity(String linkedEntityType, Long linkedEntityId) {
		return archiveRepository.findByLinkedEntityTypeAndLinkedEntityId(linkedEntityType, linkedEntityId);
	}

	@Override
	public Archive updateMetadata(Long id, String newOriginalFilename, TypeArchive type, String linkedEntityType, Long linkedEntityId) {
		Archive archive = archiveRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Archive not found"));
		if (newOriginalFilename != null && !newOriginalFilename.isBlank()) {
			archive.setOriginalFilename(newOriginalFilename);
		}
		if (type != null) {
			archive.setType(type);
		}
		archive.setLinkedEntityType(linkedEntityType);
		archive.setLinkedEntityId(linkedEntityId);
		return archiveRepository.save(archive);
	}

	@Override
	public void delete(Long id) throws IOException {
		Archive archive = archiveRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Archive not found"));
		Path path = Paths.get(archive.getStoragePath());
		archiveRepository.deleteById(id);
		try {
			Files.deleteIfExists(path);
		} catch (IOException ex) {
			// swallow to keep DB in sync even if file missing
		}
	}

	private String computeSha256(Path filePath) throws IOException, NoSuchAlgorithmException {
		MessageDigest digest = MessageDigest.getInstance("SHA-256");
		byte[] data = Files.readAllBytes(filePath);
		byte[] hash = digest.digest(data);
		StringBuilder hex = new StringBuilder();
		for (byte b : hash) {
			String h = Integer.toHexString(0xff & b);
			if (h.length() == 1) hex.append('0');
			hex.append(h);
		}
		return hex.toString();
	}
}