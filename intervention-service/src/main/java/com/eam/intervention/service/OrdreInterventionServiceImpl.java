package com.eam.intervention.service;

import com.eam.intervention.entity.OrdreIntervention;
import com.eam.intervention.repository.OrdreInterventionRepository;
import com.eam.common.enums.Statut;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
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
        // Initial status must be EN_ATTENTE
        if (ordreIntervention.getStatut() == null) {
            ordreIntervention.setStatut(Statut.EN_ATTENTE);
        }
        return ordreInterventionRepository.save(ordreIntervention);
    }

    @Override
    public void removeOrdreIntervention(Long id) {
        ordreInterventionRepository.deleteById(id);
    }

    @Override
    public OrdreIntervention modifyOrdreIntervention(OrdreIntervention ordreIntervention) {
        OrdreIntervention existing = ordreInterventionRepository.findById(ordreIntervention.getId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("OrdreIntervention not found"));
        validateTransition(existing.getStatut(), ordreIntervention.getStatut());
        return ordreInterventionRepository.save(ordreIntervention);
    }

    private void validateTransition(Statut from, Statut to) {
        if (from == to) return;
        if (from == null || to == null) return;
        // Allowed transitions: EN_ATTENTE -> EN_COURS -> TERMINÉ; EN_ATTENTE/EN_COURS -> ANNULÉ
        if (from == Statut.EN_ATTENTE && EnumSet.of(Statut.EN_COURS, Statut.ANNULÉ).contains(to)) return;
        if (from == Statut.EN_COURS && EnumSet.of(Statut.TERMINÉ, Statut.ANNULÉ).contains(to)) return;
        throw new IllegalStateException("Invalid status transition from " + from + " to " + to);
    }
}
    