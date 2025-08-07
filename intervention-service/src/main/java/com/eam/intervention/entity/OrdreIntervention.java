package com.eam.intervention.entity;

import com.eam.common.entity.BaseOrdreIntervention;
import com.eam.common.interfaces.IOrdreTravail;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.builder.ToStringExclude;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "ordre_intervention")
public class OrdreIntervention extends BaseOrdreIntervention {

    @JsonIgnore
    @ToStringExclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordre_travail_id", insertable = false, updatable = false)
    private OrdreTravailProxy ordreTravailEntity;

    @Transient
    private IOrdreTravail ordreTravail;

    // Proxy class to avoid direct dependency
    @Entity
    @Table(name = "ordre_travail")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrdreTravailProxy implements IOrdreTravail {
        @Id
        private Long id;
        private String titre;
        private String description;
        private java.util.Date dateCreation;
        @Enumerated(EnumType.STRING)
        private com.eam.common.enums.Priorite priorité;
    }

    // Sync methods
    @PostLoad
    @PostPersist
    @PostUpdate
    private void syncOrdreTravail() {
        if (ordreTravailEntity != null) {
            this.ordreTravail = ordreTravailEntity;
        }
    }

    @PrePersist
    @PreUpdate
    private void syncOrdreTravailId() {
        if (ordreTravail != null && ordreTravail.getId() != null) {
            this.setOrdreTravailId(ordreTravail.getId());
        }
    }
}
