package com.eam.intervention.service;

import com.eam.intervention.entity.OrdreIntervention;
import java.util.List;

public interface IOrdreInterventionService {
    List<OrdreIntervention> retrieveAllOrdreInterventions();
    OrdreIntervention retrieveOrdreIntervention(Long id);
    OrdreIntervention addOrdreIntervention(OrdreIntervention ordreIntervention);
    void removeOrdreIntervention(Long id);
    OrdreIntervention modifyOrdreIntervention(OrdreIntervention ordreIntervention);
}