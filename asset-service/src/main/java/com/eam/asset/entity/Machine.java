package com.eam.asset.entity;

import com.eam.asset.enums.Statut;
import java.util.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "emplacement ne doit pas etre null")
    @NotBlank(message = "emplacement est blank")
    private String emplacement;

    @NotNull
    // Default value: EN_ATTENTE
    @Enumerated(EnumType.STRING)
    private Statut statut = Statut.EN_ATTENTE;

    @NotNull
    @NotBlank
    private String type;

    @NotNull
    @Past(message = "La date de dernière maintenance doit être antérieure à aujourd'hui")
    private Date dateDernièreMaintenance;

    @NotNull
    @Future(message = "La date de prochaine maintenance doit être postérieure à aujourd'hui")
    private Date dateProchaineMainenance;

    @NotNull
    @NotBlank
    private String nom;

    // ===== FRONTEND ALIGNMENT FIELDS =====
    /**
     * Additional descriptive fields to align with sagmcom-eam-55-main template
     */
    private String model;
    private String serialNumber;
    private String manufacturer;
    
    @Temporal(TemporalType.DATE)
    private Date installedDate;
    
    /**
     * Functional status specific to assets (independent from workflow 'statut')
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "asset_status")
    private com.eam.asset.enums.AssetStatus assetStatus = com.eam.asset.enums.AssetStatus.OPERATIONAL;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "condition_level")
    private com.eam.asset.enums.ConditionLevel condition = com.eam.asset.enums.ConditionLevel.GOOD;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "criticality_level")
    private com.eam.asset.enums.CriticalityLevel criticality = com.eam.asset.enums.CriticalityLevel.MEDIUM;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    // ===== ODOO INTEGRATION FIELDS =====
    // These fields enable Odoo synchronization while preserving existing structure
    
    /**
     * Odoo Asset ID for synchronization
     * Nullable - only set when machine is synced with Odoo
     */
    @Column(name = "odoo_asset_id")
    private Integer odooAssetId;
    
    /**
     * Last synchronization timestamp with Odoo
     * Helps track sync status and avoid conflicts
     */
    @Column(name = "last_odoo_sync")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastOdooSync;
    
    /**
     * Indicates if this machine was imported from Odoo
     * Helps distinguish between EAM-native and Odoo-imported assets
     */
    @Column(name = "imported_from_odoo")
    private Boolean importedFromOdoo = false;
    
    /**
     * Asset value for Odoo integration
     * Optional field that can be used for financial tracking
     */
    @Column(name = "asset_value")
    private Double assetValue;
    
    /**
     * Odoo-specific state mapping
     * Stores the original Odoo state for reference
     */
    @Column(name = "odoo_state")
    private String odooState;

    // ===== HELPER METHODS =====
    
    /**
     * Marks this machine as synced with Odoo
     */
    public void markSyncedWithOdoo(Integer odooAssetId) {
        this.odooAssetId = odooAssetId;
        this.lastOdooSync = new Date();
    }
    
    /**
     * Checks if this machine is synced with Odoo
     */
    public boolean isSyncedWithOdoo() {
        return this.odooAssetId != null;
    }
    
    /**
     * Marks this machine as imported from Odoo
     */
    public void markAsImportedFromOdoo() {
        this.importedFromOdoo = true;
        this.lastOdooSync = new Date();
    }
}
