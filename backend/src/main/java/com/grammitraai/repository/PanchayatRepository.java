package com.grammitraai.repository;

import com.grammitraai.model.Panchayat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PanchayatRepository extends JpaRepository<Panchayat, Long> {
    List<Panchayat> findByBlockName(String blockName);
}
