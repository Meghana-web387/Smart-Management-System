package com.smart.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String activityName;

    private LocalDateTime activityDate;

    private String status = "IN_PROGRESS"; // e.g., PLANNED, IN_PROGRESS, COMPLETED

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
