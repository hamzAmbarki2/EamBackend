package com.eam.workorder.service;

import com.eam.workorder.entity.OrdreTravail;
import com.eam.common.enums.DepartmentType;
import java.util.List;
import java.util.stream.Collectors;

public interface IOrdreTravailService {
    List<OrdreTravail> retrieveAllOrdreTravails();
    OrdreTravail retrieveOrdreTravail(Long id);
    OrdreTravail addOrdreTravail(OrdreTravail OrdreTravail);
    void removeOrdreTravail(Long id);
    OrdreTravail modifyOrdreTravail(OrdreTravail OrdreTravail);
    List<OrdreTravail> retrieveOrdreTravailsByDepartment(DepartmentType department);
    List<OrdreTravail> retrieveOrdreTravailsByAssignedTo(Long assignedTo);
}