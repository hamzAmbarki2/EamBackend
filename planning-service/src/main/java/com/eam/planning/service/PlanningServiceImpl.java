package com.eam.planning.service;

import com.eam.planning.entity.Planning;
import com.eam.planning.repository.PlanningRepository;
import com.eam.common.enums.DepartmentType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PlanningServiceImpl implements IPlanningService {

    private final PlanningRepository planningRepository;
    
    @Override
    public List<Planning> retrieveAllPlannings() {
        return planningRepository.findAll();
    }

    @Override
    public Planning retrievePlanning(Long id) {
        return planningRepository.findById(id).orElse(null);
    }

    @Override
    public Planning addPlanning(Planning planning) {
        return planningRepository.save(planning);
    }

    @Override
    public void removePlanning(Long id) {
        planningRepository.deleteById(id);
    }

    @Override
    public Planning modifyPlanning(Planning planning) {
        return planningRepository.save(planning);
    }

    @Override
    public List<Planning> retrievePlanningsByDepartment(DepartmentType department) {
        return planningRepository.findByDepartment(department);
    }
}