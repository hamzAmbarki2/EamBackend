package com.eam.asset.control;

import com.eam.asset.entity.Machine;
import com.eam.asset.service.IMachineService;
import com.eam.common.security.annotations.RoleAllowed;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machine")
@AllArgsConstructor
public class MachineRestController {

    private final IMachineService machineService;
    
    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-all-machines")
    public List<Machine> getMachines() {
        return machineService.retrieveAllMachines();
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH", "TECHNICIEN"})
    @GetMapping("/retrieve-machine/{id}")
    public ResponseEntity<Machine> getMachine(@PathVariable Long id) {
        Machine dto = machineService.retrieveMachine(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PostMapping("/add-machine")
    public Machine addMachine(@Valid @RequestBody Machine machine) {
        return machineService.addMachine(machine);
    }

    @RoleAllowed({"ADMIN", "CHEFOP", "CHEFTECH"})
    @PutMapping("/update-machine")
    public Machine updateMachine(@Valid @RequestBody Machine machine) {
        return machineService.modifyMachine(machine);
    }

    @RoleAllowed({"ADMIN"})
    @DeleteMapping("/delete-machine/{id}")
    public void deleteMachine(@PathVariable Long id) {
        machineService.removeMachine(id);
    }
}
   