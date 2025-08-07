package com.eam.workorder.service;

import com.eam.workorder.entity.OrdreTravail;
import java.util.List;
import java.util.stream.Collectors;

public interface IOrdreTravailService {
    List<OrdreTravail> retrieveAllOrdreTravails();
    OrdreTravail retrieveOrdreTravail(Long id);
    OrdreTravail addOrdreTravail(OrdreTravail OrdreTravail);
    void removeOrdreTravail(Long id);
    OrdreTravail modifyOrdreTravail(OrdreTravail OrdreTravail);
}