package com.smart.management.controller;

import com.smart.management.repository.ActivityRepository;
import com.smart.management.repository.RecordRepository;
import com.smart.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RecordRepository recordRepository;

    @Autowired
    ActivityRepository activityRepository;

    @GetMapping("/summary")
    public Map<String, Long> getSummary() {
        Map<String, Long> summary = new HashMap<>();
        summary.put("totalUsers", userRepository.count());
        summary.put("totalRecords", recordRepository.count());
        summary.put("totalActivities", activityRepository.count());
        return summary;
    }
}
