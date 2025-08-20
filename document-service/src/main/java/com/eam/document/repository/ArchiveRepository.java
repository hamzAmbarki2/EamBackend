package com.eam.document.repository;

import com.eam.document.entity.Archive;
import com.eam.document.enums.TypeArchive;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArchiveRepository extends JpaRepository<Archive, Long> {
	List<Archive> findByType(TypeArchive type);
	List<Archive> findByLinkedEntityTypeAndLinkedEntityId(String linkedEntityType, Long linkedEntityId);
}
