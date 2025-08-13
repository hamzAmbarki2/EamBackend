package com.example.odoo.dto;

public class MaintenanceRequestDTO {
    public Integer id;
    public String name;            // Title
    public Integer equipmentId;    // maintenance.equipment id
    public String description;
    public String requestDate;     // date
    public String stage;           // stage_id display
    public Integer createdBy;      // create_uid

    public MaintenanceRequestDTO() {}
}
