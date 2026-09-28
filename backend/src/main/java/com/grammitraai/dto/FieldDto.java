package com.grammitraai.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FieldDto {
    private Long id;
    private Long userId;
    private String fieldName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal areaAcres;
    private String cropName;
    private LocalDate sowingDate;
    private String soilType;
    private String irrigationType;
    private String village;
    private String panchayat;
    private String block;
    private String district;
    private String state;
    private String boundaryCoordinatesJson;
}
