package com.grammitraai.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "panchayats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Panchayat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    private String blockName;
    private String districtName;
    private String stateName;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    private BigDecimal elevationMeters = BigDecimal.valueOf(500.0);
    private String soilTypePrimary;
    private BigDecimal ndviBaseline = BigDecimal.valueOf(0.55);
    private BigDecimal distanceToWaterKm = BigDecimal.valueOf(1.5);
}
