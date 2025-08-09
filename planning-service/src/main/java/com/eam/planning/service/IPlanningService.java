
package com.eam.planning.service;

import com.eam.planning.entity.Planning;
import java.util.List;
import java.util.stream.Collectors;
import com.eam.common.enums.DepartmentType;

public interface IPlanningService {
    List<Planning> retrieveAllPlannings();
    Planning retrievePlanning(Long id);
    Planning addPlanning(Planning planning);
    void removePlanning(Long id);
    Planning modifyPlanning(Planning planning);
    List<Planning> retrievePlanningsByDepartment(DepartmentType department);
}
