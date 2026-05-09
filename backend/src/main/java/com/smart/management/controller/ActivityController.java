package com.smart.management.controller;

import com.smart.management.entity.Activity;
import com.smart.management.entity.User;
import com.smart.management.repository.ActivityRepository;
import com.smart.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    @GetMapping("/my")
    public List<Activity> getMyActivities() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return activityRepository.findByAssignedUser(user);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public Activity createActivity(@RequestBody Activity activity) {
        return activityRepository.save(activity);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id, @RequestBody Activity details) {
        Activity activity = activityRepository.findById(id).orElseThrow();
        activity.setActivityName(details.getActivityName());
        activity.setStatus(details.getStatus());
        activity.setRemarks(details.getRemarks());
        return ResponseEntity.ok(activityRepository.save(activity));
    }
}
