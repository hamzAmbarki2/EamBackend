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
        if (ordreIntervention.getId() != null) {
            OrdreIntervention existing = retrieveOrdreIntervention(ordreIntervention.getId());
            if (existing != null && ordreIntervention.getStatut() != null && existing.getStatut() != null) {
                validateStatusTransition(existing.getStatut(), ordreIntervention.getStatut());
            }
        }
        return ordreInterventionRepository.save(ordreIntervention);
    }

    private void validateStatusTransition(com.eam.common.enums.Statut from, com.eam.common.enums.Statut to) {
        switch (from) {
            case EN_ATTENTE -> {
                if (!(to == com.eam.common.enums.Statut.EN_COURS || to == com.eam.common.enums.Statut.ANNULÉ)) {
                    throw new IllegalArgumentException("Invalid transition from EN_ATTENTE to " + to);
                }
            }
            case EN_COURS -> {
                if (!(to == com.eam.common.enums.Statut.TERMINÉ || to == com.eam.common.enums.Statut.ANNULÉ)) {
                    throw new IllegalArgumentException("Invalid transition from EN_COURS to " + to);
                }
            }
            case TERMINÉ, ANNULÉ -> {
                if (to != from) {
                    throw new IllegalArgumentException("Cannot transition from final state " + from + " to " + to);
                }
            }
            default -> {}
        }
    }
}
    