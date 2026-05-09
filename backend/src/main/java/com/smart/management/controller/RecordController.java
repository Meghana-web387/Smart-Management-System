package com.smart.management.controller;

import com.smart.management.entity.Record;
import com.smart.management.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
public class RecordController {
    @Autowired
    RecordRepository recordRepository;

    @GetMapping
    public List<Record> getAllRecords() {
        return recordRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public Record createRecord(@RequestBody Record record) {
        return recordRepository.save(record);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<Record> updateRecord(@PathVariable Long id, @RequestBody Record recordDetails) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        record.setTitle(recordDetails.getTitle());
        record.setDescription(recordDetails.getDescription());
        record.setStatus(recordDetails.getStatus());

        return ResponseEntity.ok(recordRepository.save(record));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRecord(@PathVariable Long id) {
        recordRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
