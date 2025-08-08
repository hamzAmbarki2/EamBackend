package com.eam.workorder.service;

import com.eam.workorder.entity.OrdreTravail;
import com.eam.workorder.repository.OrdreTravailRepository;
import com.eam.common.enums.DepartmentType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OrdreTravailServiceImpl implements IOrdreTravailService {

    private final OrdreTravailRepository ordreTravailRepository;
    
    @Override
    public List<OrdreTravail> retrieveAllOrdreTravails() {
        return ordreTravailRepository.findAll();
    }

    @Override
    public OrdreTravail retrieveOrdreTravail(Long id) {
        return ordreTravailRepository.findById(id).orElse(null);
    }

    @Override
    public OrdreTravail addOrdreTravail(OrdreTravail ordreTravail) {
        return ordreTravailRepository.save(ordreTravail);
    }

    @Override
    public void removeOrdreTravail(Long id) {
        ordreTravailRepository.deleteById(id);
    }

    @Override
    public OrdreTravail modifyOrdreTravail(OrdreTravail ordreTravail) {
        return ordreTravailRepository.save(ordreTravail);
    }

    @Override
    public List<OrdreTravail> retrieveOrdreTravailsByDepartment(DepartmentType department) {
        return ordreTravailRepository.findByDepartment(department);
    }

    @Override
    public List<OrdreTravail> retrieveOrdreTravailsByAssignedTo(Long assignedTo) {
        return ordreTravailRepository.findByAssignedTo(assignedTo);
    }
}