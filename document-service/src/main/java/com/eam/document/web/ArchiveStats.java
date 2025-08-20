package com.eam.document.web;

import com.eam.document.enums.TypeArchive;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class ArchiveStats {
	private long totalCount;
	private long totalBytes;
	private Map<TypeArchive, Long> countByType;
}