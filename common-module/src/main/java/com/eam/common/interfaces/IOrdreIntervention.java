package com.eam.common.interfaces;

import com.eam.common.enums.Priorite;
import com.eam.common.enums.Statut;
import java.util.Date;

/**
 * Interface commune pour les ordres d'intervention
 * Cette interface permet de découpler les modules intervention et work-order
 */
public interface IOrdreIntervention {
    
    Long getId();
    void setId(Long id);
    
    String getTitre();
    void setTitre(String titre);
    
    String getDescription();
    void setDescription(String description);
    
    Date getDateCreation();
    void setDateCreation(Date dateCreation);
    
    Priorite getPriorité();
    void setPriorité(Priorite priorité);
    
    Statut getStatut();
    void setStatut(Statut statut);
    
    String getRapport();
    void setRapport(String rapport);
    
    Date getDateIntervention();
    void setDateIntervention(Date dateIntervention);
    
    IOrdreTravail getOrdreTravail();
    void setOrdreTravail(IOrdreTravail ordreTravail);
}

