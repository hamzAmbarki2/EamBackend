package com.eam.document.service;

import com.eam.document.entity.Archive;
import com.eam.document.enums.TypeArchive;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IDocumentService {
	Archive store(MultipartFile file, TypeArchive type, String linkedEntityType, Long linkedEntityId) throws IOException;
	Resource loadAsResource(Long archiveId) throws IOException;
	Optional<Archive> findById(Long id);
	List<Archive> findAll();
	List<Archive> findByType(TypeArchive type);
	List<Archive> findByLinkedEntity(String linkedEntityType, Long linkedEntityId);
	Archive updateMetadata(Long id, String newOriginalFilename, TypeArchive type, String linkedEntityType, Long linkedEntityId);
	void delete(Long id) throws IOException;
}