package com.eam.asset.service;

import com.eam.asset.entity.Machine;
import com.eam.asset.repository.MachineRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MachineServiceImpl implements IMachineService {

    private final MachineRepository machineRepository;

    @Override
    public List<Machine> retrieveAllMachines() {
        return machineRepository.findAll();
    }

    @Override
    public Machine retrieveMachine(Long id) {
        return machineRepository.findById(id).orElse(null);
    }

    @Override
    public Machine addMachine(Machine machine) {
        return machineRepository.save(machine);
    }

    @Override
    public void removeMachine(Long id) {
        machineRepository.deleteById(id);
    }

    @Override
    public Machine modifyMachine(Machine machine) {
        return machineRepository.save(machine);
    }
}
    