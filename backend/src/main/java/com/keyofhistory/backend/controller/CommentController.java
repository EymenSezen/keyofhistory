package com.keyofhistory.backend.controller;

import com.keyofhistory.backend.model.Comment;
import com.keyofhistory.backend.model.HistoricalEvent;
import com.keyofhistory.backend.model.User;
import com.keyofhistory.backend.repository.CommentRepository;
import com.keyofhistory.backend.repository.HistoricalEventRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events/{eventId}/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private HistoricalEventRepository eventRepository;

    @Data
    public static class CommentRequest {
        @NotBlank(message = "Comment content cannot be empty")
        private String content;
    }

    @GetMapping
    public ResponseEntity<?> getCommentsForEvent(@PathVariable Long eventId) {
        Optional<HistoricalEvent> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Historical event not found"));
        }

        List<Comment> comments = commentRepository.findByEventIdOrderByCreatedAtDesc(eventId);
        
        // Map to a clean response list to avoid recursion/infinite serialization loop
        List<Map<String, Object>> response = comments.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("content", c.getContent());
            map.put("createdAt", c.getCreatedAt().toString());
            map.put("username", c.getUser() != null ? c.getUser().getUsername() : "Anonymous");
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addComment(
            @PathVariable Long eventId, 
            @Valid @RequestBody CommentRequest commentRequest, 
            HttpServletRequest request
    ) {
        User currentUser = (User) request.getAttribute("currentUser");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized! Must be logged in to comment."));
        }

        Optional<HistoricalEvent> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Historical event not found"));
        }

        Comment comment = Comment.builder()
                .content(commentRequest.getContent())
                .createdAt(LocalDateTime.now())
                .user(currentUser)
                .event(eventOpt.get())
                .build();

        commentRepository.save(comment);

        Map<String, Object> response = new HashMap<>();
        response.put("id", comment.getId());
        response.put("content", comment.getContent());
        response.put("createdAt", comment.getCreatedAt().toString());
        response.put("username", currentUser.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
