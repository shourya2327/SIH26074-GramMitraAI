package com.grammitraai.controller;

import com.grammitraai.dto.FieldDto;
import com.grammitraai.service.FieldService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields")
@CrossOrigin(origins = "*")
public class FieldController {

    private final FieldService fieldService;

    public FieldController(FieldService fieldService) {
        this.fieldService = fieldService;
    }

    @GetMapping
    public ResponseEntity<List<FieldDto>> getFields(@RequestParam(required = false, defaultValue = "1") Long userId) {
        return ResponseEntity.ok(fieldService.getFieldsByUser(userId));
    }

    @PostMapping
    public ResponseEntity<FieldDto> saveField(@RequestBody FieldDto fieldDto) {
        return ResponseEntity.ok(fieldService.saveField(fieldDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteField(@PathVariable Long id) {
        fieldService.deleteField(id);
        return ResponseEntity.ok().build();
    }
}
