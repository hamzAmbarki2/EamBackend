package com.eam.planning.entity;

import com.eam.planning.enums.TypePlanning;
import com.eam.common.enums.DepartmentType;
import java.util.Date;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Planning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date dateDebut;

    private Date dateFin;

    @Enumerated(EnumType.STRING)
    private TypePlanning typePlanning;

    @Enumerated(EnumType.STRING)
    private DepartmentType department;

}