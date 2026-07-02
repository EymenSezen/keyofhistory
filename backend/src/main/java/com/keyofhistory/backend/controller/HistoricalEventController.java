package com.keyofhistory.backend.controller;

import com.keyofhistory.backend.model.HistoricalEvent;
import com.keyofhistory.backend.model.User;
import com.keyofhistory.backend.service.HistoricalEventService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class HistoricalEventController {

    private final HistoricalEventService service;

    @GetMapping
    public ResponseEntity<List<HistoricalEvent>> getAllEvents(
            @RequestParam(required = false) String search,
            HttpServletRequest request
    ) {
        User currentUser = (User) request.getAttribute("currentUser");
        String role = currentUser != null ? currentUser.getRole() : null;
        String username = currentUser != null ? currentUser.getUsername() : null;

        if (search != null) {
            return ResponseEntity.ok(service.searchEventsFiltered(search, role, username));
        }
        return ResponseEntity.ok(service.getAllEventsFiltered(role, username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoricalEvent> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<?> createEvent(
            @Valid @RequestBody HistoricalEvent event,
            HttpServletRequest request
    ) {
        User currentUser = (User) request.getAttribute("currentUser");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized. Please log in."));
        }
        if (!"ADMIN".equals(currentUser.getRole()) && !"AUTHOR".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied. Authors and Admins only."));
        }

        // Set system-assigned values
        event.setAuthor(currentUser.getUsername());
        event.setApproved("ADMIN".equals(currentUser.getRole()));
        event.setLikes(0);

        HistoricalEvent created = service.createEvent(event);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id, 
            @Valid @RequestBody HistoricalEvent eventDetails,
            HttpServletRequest request
    ) {
        User currentUser = (User) request.getAttribute("currentUser");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized. Please log in."));
        }

        HistoricalEvent existing = service.getEventById(id);
        
        // Authorization check: ADMIN can update anything, AUTHOR can only update their own events
        boolean isAdmin = "ADMIN".equals(currentUser.getRole());
        boolean isOwner = currentUser.getUsername().equals(existing.getAuthor());
        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied. You can only update your own events."));
        }

        HistoricalEvent updated = service.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized. Please log in."));
        }

        HistoricalEvent existing = service.getEventById(id);

        // Authorization check: ADMIN can delete anything, AUTHOR can only delete their own events
        boolean isAdmin = "ADMIN".equals(currentUser.getRole());
        boolean isOwner = currentUser.getUsername().equals(existing.getAuthor());
        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied. You can only delete your own events."));
        }

        service.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveEvent(@PathVariable Long id, HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        if (currentUser == null || !"ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied. Admins only."));
        }

        HistoricalEvent approved = service.approveEvent(id);
        return ResponseEntity.ok(approved);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeEvent(@PathVariable Long id, HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized. Log in to like."));
        }

        HistoricalEvent liked = service.likeEvent(id);
        return ResponseEntity.ok(liked);
    }
}
