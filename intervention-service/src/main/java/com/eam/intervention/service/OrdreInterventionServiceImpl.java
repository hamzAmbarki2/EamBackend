package com.eam.intervention.service;

import com.eam.intervention.entity.OrdreIntervention;
import com.eam.intervention.repository.OrdreInterventionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OrdreInterventionServiceImpl implements IOrdreInterventionService {

    private final OrdreInterventionRepository ordreInterventionRepository;
    
    @Override
    public List<OrdreIntervention> retrieveAllOrdreInterventions() {
        return ordreInterventionRepository.findAll();
    }

    @Override
    public OrdreIntervention retrieveOrdreIntervention(Long id) {
        return ordreInterventionRepository.findById(id).orElse(null);
    }

    @Override
    public OrdreIntervention addOrdreIntervention(OrdreIntervention ordreIntervention) {
        return ordreInterventionRepository.save(ordreIntervention);
    }

    @Override
    public void removeOrdreIntervention(Long id) {
        ordreInterventionRepository.deleteById(id);
    }

    @Override
    public OrdreIntervention modifyOrdreIntervention(OrdreIntervention ordreIntervention) {
        return ordreInterventionRepository.save(ordreIntervention);
    }
}
    