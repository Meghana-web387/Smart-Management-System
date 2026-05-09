package com.smart.management.repository;

import com.smart.management.entity.Activity;
import com.smart.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByAssignedUser(User user);
}
