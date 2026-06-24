package com.keyofhistory.backend.controller;

import com.keyofhistory.backend.model.HistoricalEvent;
import com.keyofhistory.backend.service.HistoricalEventService;
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

/**
 * REST Controller for Historical Events (similar to ApiController and ControllerBase in .NET Core)
 * Configures CrossOrigin to allow React frontend (default Vite dev server runs on 5173).
 */
@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*") // In production, we would limit this or use Ingress routing
@RequiredArgsConstructor
public class HistoricalEventController {

    private final HistoricalEventService service;

    @GetMapping
    public ResponseEntity<List<HistoricalEvent>> getAllEvents(@RequestParam(required = false) String search) {
        if (search != null) {
            return ResponseEntity.ok(service.searchEvents(search));
        }
        return ResponseEntity.ok(service.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoricalEvent> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<HistoricalEvent> createEvent(@Valid @RequestBody HistoricalEvent event) {
        HistoricalEvent created = service.createEvent(event);
        return new ResponseEntity<>(created, HttpStatus.CREATED); // Returns 201 Created
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoricalEvent> updateEvent(@PathVariable Long id, @Valid @RequestBody HistoricalEvent eventDetails) {
        HistoricalEvent updated = service.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        service.deleteEvent(id);
        return ResponseEntity.noContent().build(); // Returns 204 No Content
    }
}
