package com.keyofhistory.backend.service;

import com.keyofhistory.backend.config.RabbitMQConfig;
import com.keyofhistory.backend.dto.HistoricalEventEvent;
import com.keyofhistory.backend.exception.ResourceNotFoundException;
import com.keyofhistory.backend.model.HistoricalEvent;
import com.keyofhistory.backend.repository.HistoricalEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Layer for Business Logic (similar to Service/Manager classes in .NET)
 * Uses Lombok @RequiredArgsConstructor to generate a constructor for all final fields,
 * enabling standard constructor Dependency Injection (similar to ASP.NET Core).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HistoricalEventService {

    private final HistoricalEventRepository repository;
    private final RabbitTemplate rabbitTemplate;

    @Transactional(readOnly = true)
    public List<HistoricalEvent> getAllEvents() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public HistoricalEvent getEventById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Historical event not found with id: " + id));
    }

    @Transactional
    public HistoricalEvent createEvent(HistoricalEvent event) {
        // Enforce ID is null for new records to prevent updates
        event.setId(null);
        HistoricalEvent savedEvent = repository.save(event);
        
        // Publish Event-Driven Message to RabbitMQ
        publishMessage(savedEvent, "CREATED");
        
        return savedEvent;
    }

    @Transactional
    public HistoricalEvent updateEvent(Long id, HistoricalEvent eventDetails) {
        HistoricalEvent existingEvent = getEventById(id);
        
        existingEvent.setTitle(eventDetails.getTitle());
        existingEvent.setDescription(eventDetails.getDescription());
        existingEvent.setEventDate(eventDetails.getEventDate());
        existingEvent.setEra(eventDetails.getEra());
        existingEvent.setLocation(eventDetails.getLocation());
        
        HistoricalEvent updatedEvent = repository.save(existingEvent);
        
        // Publish Event-Driven Message to RabbitMQ
        publishMessage(updatedEvent, "UPDATED");
        
        return updatedEvent;
    }

    @Transactional
    public void deleteEvent(Long id) {
        HistoricalEvent existingEvent = getEventById(id);
        repository.delete(existingEvent);
        
        // Publish Event-Driven Message to RabbitMQ
        publishMessage(existingEvent, "DELETED");
    }

    @Transactional(readOnly = true)
    public List<HistoricalEvent> searchEvents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return repository.findAll();
        }
        return repository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    @Transactional(readOnly = true)
    public List<HistoricalEvent> getAllEventsFiltered(String role, String username) {
        List<HistoricalEvent> all = repository.findAll();
        return filterEvents(all, role, username);
    }

    @Transactional(readOnly = true)
    public List<HistoricalEvent> searchEventsFiltered(String keyword, String role, String username) {
        List<HistoricalEvent> results = searchEvents(keyword);
        return filterEvents(results, role, username);
    }

    @Transactional
    public HistoricalEvent approveEvent(Long id) {
        HistoricalEvent existingEvent = getEventById(id);
        existingEvent.setApproved(true);
        HistoricalEvent saved = repository.save(existingEvent);
        publishMessage(saved, "APPROVED");
        return saved;
    }

    @Transactional
    public HistoricalEvent likeEvent(Long id) {
        HistoricalEvent existingEvent = getEventById(id);
        existingEvent.setLikes(existingEvent.getLikes() + 1);
        HistoricalEvent saved = repository.save(existingEvent);
        publishMessage(saved, "LIKED");
        return saved;
    }

    private List<HistoricalEvent> filterEvents(List<HistoricalEvent> events, String role, String username) {
        if ("ADMIN".equals(role)) {
            return events;
        }
        return events.stream().filter(e -> {
            if (e.isApproved()) return true;
            return username != null && username.equals(e.getAuthor());
        }).collect(java.util.stream.Collectors.toList());
    }

    /**
     * Helper method to publish message asynchronously to RabbitMQ exchange
     */
    private void publishMessage(HistoricalEvent event, String action) {
        try {
            HistoricalEventEvent eventDto = HistoricalEventEvent.builder()
                    .eventId(event.getId())
                    .title(event.getTitle())
                    .era(event.getEra())
                    .action(action)
                    .build();
            
            log.info("Publishing event to RabbitMQ: {} - {}", action, event.getTitle());
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, eventDto);
        } catch (Exception e) {
            // In a real application, we would use a transactional outbox pattern to prevent message loss.
            // For now, we log it so that a broker outage doesn't fail the primary DB transaction.
            log.error("Failed to publish event to RabbitMQ for event ID: " + event.getId(), e);
        }
    }
}
