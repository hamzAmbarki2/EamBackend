package com.eam.workorder.control;

import com.eam.workorder.entity.OrdreTravail;
import com.eam.workorder.service.IOrdreTravailService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordreTravail")
@AllArgsConstructor
public class OrdreTravailRestController {

    private final IOrdreTravailService ordreTravailService;
    
    @GetMapping("/retrieve-all-ordreTravails")
    public List<OrdreTravail> getOrdreTravails() {
        return ordreTravailService.retrieveAllOrdreTravails();
    }

    @GetMapping("/retrieve-ordreTravail/{id}")
    public ResponseEntity<OrdreTravail> getOrdreTravail(@PathVariable Long id) {
        OrdreTravail dto = ordreTravailService.retrieveOrdreTravail(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/add-ordreTravail")
    public OrdreTravail addOrdreTravail(@Valid @RequestBody OrdreTravail ordreTravail) {
        return ordreTravailService.addOrdreTravail(ordreTravail);
    }

    @PutMapping("/update-ordreTravail")
    public OrdreTravail updateOrdreTravail(@Valid @RequestBody OrdreTravail ordreTravail) {
        return ordreTravailService.modifyOrdreTravail(ordreTravail);
    }

    @DeleteMapping("/delete-ordreTravail/{id}")
    public void deleteOrdreTravail(@PathVariable Long id) {
        ordreTravailService.removeOrdreTravail(id);
    }
}