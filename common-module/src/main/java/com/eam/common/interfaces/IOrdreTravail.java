package com.eam.common.interfaces;

import com.eam.common.enums.Priorite;
import java.util.Date;

/**
 * Interface commune pour les ordres de travail
 * Cette interface permet de découpler les modules intervention et work-order
 */
public interface IOrdreTravail {
    
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
}

