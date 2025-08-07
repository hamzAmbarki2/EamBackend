package com.eam.asset.entity;

import com.eam.asset.enums.Statut;
import java.util.Date;


import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "emplacement ne doit pas etre null")
    @NotBlank(message = "emplacement est blank")
    private String emplacement;

    @NotNull
    // Default value: EN_ATTENTE
    @Enumerated(EnumType.STRING)
    private Statut statut = Statut.EN_ATTENTE;

    @NotNull
    @NotBlank
    private String type;

    @NotNull
    @Past(message = "La date de dernière maintenance doit être antérieure à aujourd'hui")
    private Date dateDernièreMaintenance;

    @NotNull
    @Future(message = "La date de prochaine maintenance doit être postérieure à aujourd'hui")
    private Date dateProchaineMainenance;

    @NotNull
    @NotBlank
    private String nom;

}