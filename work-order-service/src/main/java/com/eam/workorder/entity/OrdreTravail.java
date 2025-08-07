package com.eam.workorder.entity;

import java.util.Set;

import com.eam.common.entity.BaseOrdreTravail;
import com.eam.common.interfaces.IOrdreIntervention;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringExclude;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ordre_travail")
public class OrdreTravail extends BaseOrdreTravail {

    @JsonIgnore
    @ToStringExclude
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ordre_travail_id")  // JoinColumn only here, no mappedBy
    private Set<OrdreInterventionProxy> ordreInterventions;

    // Proxy class to avoid direct dependency
    @Entity
    @Table(name = "ordre_intervention")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrdreInterventionProxy implements IOrdreIntervention {
        @Id
        private Long id;
        private String titre;
        private String description;
        private java.util.Date dateCreation;
        @Enumerated(EnumType.STRING)
        private com.eam.common.enums.Priorite priorité;
        @Enumerated(EnumType.STRING)
        private com.eam.common.enums.Statut statut;
        private String rapport;
        private java.util.Date dateIntervention;

        @Column(name = "ordre_travail_id")
        private Long ordreTravailId;

        @Transient
        private com.eam.common.interfaces.IOrdreTravail ordreTravail;
    }
}
