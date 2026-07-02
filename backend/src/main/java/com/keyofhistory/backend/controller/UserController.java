package com.keyofhistory.backend.controller;

import com.keyofhistory.backend.model.User;
import com.keyofhistory.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Data
    public static class RoleUpdateRequest {
        private String role; // "ADMIN", "AUTHOR", "USER"
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        if (currentUser == null || !"ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied. Admins only."));
        }

        List<User> users = userRepository.findAll();
        // Hide password hashes from the response for security
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id, 
            @RequestBody RoleUpdateRequest roleUpdateRequest, 
            HttpServletRequest request
    ) {
        User currentUser = (User) request.getAttribute("currentUser");
        if (currentUser == null || !"ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied. Admins only."));
        }

        String targetRole = roleUpdateRequest.getRole();
        if (!"ADMIN".equals(targetRole) && !"AUTHOR".equals(targetRole) && !"USER".equals(targetRole)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid role specified. Must be ADMIN, AUTHOR, or USER."));
        }

        Optional<User> targetUserOpt = userRepository.findById(id);
        if (targetUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found."));
        }

        User targetUser = targetUserOpt.get();
        targetUser.setRole(targetRole);
        userRepository.save(targetUser);

        return ResponseEntity.ok(Map.of("message", "User role updated to " + targetRole + " successfully."));
    }
}
