package com.eam.document.entity;

import com.eam.document.enums.TypeArchive;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "archives")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Archive {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Column(nullable = false)
	private String filename;

	@NotBlank
	@Column(nullable = false)
	private String originalFilename;

	@NotBlank
	@Column(nullable = false)
	private String contentType;

	@Column(length = 64)
	private String checksumSha256;

	@NotNull
	@Column(nullable = false)
	private Long sizeBytes;

	@NotBlank
	@Column(nullable = false)
	private String storagePath;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TypeArchive type;

	@Column(nullable = false)
	private Integer version;

	@Column
	private String linkedEntityType; // e.g., USER, MACHINE, WORK_ORDER, INTERVENTION, PLANNING

	@Column
	private Long linkedEntityId;

	@Column(nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@Column
	private OffsetDateTime updatedAt;

	@PrePersist
	public void onCreate() {
		this.createdAt = OffsetDateTime.now();
	}

	@PreUpdate
	public void onUpdate() {
		this.updatedAt = OffsetDateTime.now();
	}
}