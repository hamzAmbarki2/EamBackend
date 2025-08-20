package com.eam.document.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "rapports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rapport {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@Column(nullable = false)
	private Long interventionId; // rapport lié à une intervention

	@OneToOne(optional = false, cascade = CascadeType.ALL)
	@JoinColumn(name = "archive_id", nullable = false, unique = true)
	private Archive archive; // stockage du fichier généré

	@NotBlank
	@Column(nullable = false)
	private String titre;

	@Column(length = 4000)
	private String description;

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
