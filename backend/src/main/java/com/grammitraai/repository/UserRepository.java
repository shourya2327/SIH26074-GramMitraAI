package com.grammitraai.repository;

import com.grammitraai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMobileNumber(String mobileNumber);
    Optional<User> findByEmail(String email);
    Boolean existsByMobileNumber(String mobileNumber);
    Boolean existsByEmail(String email);
}
