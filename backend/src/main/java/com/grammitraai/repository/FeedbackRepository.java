package com.grammitraai.repository;

import com.grammitraai.model.FarmerFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<FarmerFeedback, Long> {
    List<FarmerFeedback> findByUserId(Long userId);
}
