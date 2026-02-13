package com.solarpanel.faultdetection.repository;

import com.solarpanel.faultdetection.entity.SolarPlant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SolarPlantRepository extends JpaRepository<SolarPlant, Long> {
    Optional<SolarPlant> findByName(String name);
    boolean existsByName(String name);
}
