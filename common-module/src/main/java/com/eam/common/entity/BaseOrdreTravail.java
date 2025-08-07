package com.eam.common.entity;

import com.eam.common.enums.Priorite;
import com.eam.common.interfaces.IOrdreTravail;
import java.util.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public abstract class BaseOrdreTravail implements IOrdreTravail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "titre cannot be null")
    @NotBlank(message = "titre cannot be blank")
    private String titre;

    @NotNull(message = "description cannot be null")
    @NotBlank(message = "description cannot be blank")
    private String description;

    @NotNull(message = "dateCreation cannot be null")
    private Date dateCreation;

    @NotNull(message = "Priorite cannot be null")
    @Enumerated(EnumType.STRING)
    private Priorite priorité;
}

