package com.grammitraai.service;

import com.grammitraai.dto.FieldDto;
import com.grammitraai.model.Field;
import com.grammitraai.model.User;
import com.grammitraai.repository.FieldRepository;
import com.grammitraai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FieldService {

    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;

    public FieldService(FieldRepository fieldRepository, UserRepository userRepository) {
        this.fieldRepository = fieldRepository;
        this.userRepository = userRepository;
    }

    public List<FieldDto> getFieldsByUser(Long userId) {
        return fieldRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public FieldDto saveField(FieldDto dto) {
        Field field = new Field();
        if (dto.getId() != null) {
            field = fieldRepository.findById(dto.getId()).orElse(new Field());
        }

        User user = userRepository.findById(dto.getUserId() != null ? dto.getUserId() : 1L)
                .orElse(null);
        field.setUser(user);
        field.setFieldName(dto.getFieldName());
        field.setLatitude(dto.getLatitude());
        field.setLongitude(dto.getLongitude());
        field.setAreaAcres(dto.getAreaAcres());
        field.setCropName(dto.getCropName());
        field.setSowingDate(dto.getSowingDate());
        field.setSoilType(dto.getSoilType());
        field.setIrrigationType(dto.getIrrigationType());
        field.setVillage(dto.getVillage());
        field.setPanchayat(dto.getPanchayat());
        field.setBlock(dto.getBlock());
        field.setDistrict(dto.getDistrict());
        field.setState(dto.getState());
        field.setBoundaryCoordinatesJson(dto.getBoundaryCoordinatesJson());

        Field saved = fieldRepository.save(field);
        return toDto(saved);
    }

    public void deleteField(Long id) {
        fieldRepository.deleteById(id);
    }

    private FieldDto toDto(Field f) {
        return new FieldDto(
                f.getId(),
                f.getUser() != null ? f.getUser().getId() : 1L,
                f.getFieldName(),
                f.getLatitude(),
                f.getLongitude(),
                f.getAreaAcres(),
                f.getCropName(),
                f.getSowingDate(),
                f.getSoilType(),
                f.getIrrigationType(),
                f.getVillage(),
                f.getPanchayat(),
                f.getBlock(),
                f.getDistrict(),
                f.getState(),
                f.getBoundaryCoordinatesJson()
        );
    }
}
