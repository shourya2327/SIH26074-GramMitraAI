package com.grammitraai.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FarmerFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Long fieldId;
    private Long advisoryId;
    private Boolean isUseful;

    @Column(columnDefinition = "TEXT")
    private String farmerComment;

    private String actualWeatherObserved;
    private String cropConditionReported;
    private Boolean flaggedForRetraining = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
