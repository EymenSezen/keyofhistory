package com.keyofhistory.backend.consumer;

import com.keyofhistory.backend.config.RabbitMQConfig;
import com.keyofhistory.backend.dto.HistoricalEventEvent;
import com.keyofhistory.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * RabbitMQ Message Listener / Consumer (similar to MassTransit IConsumer<T> implementation in .NET)
 * Listens to the historical event queue and updates the statistics cache asynchronously.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EventConsumer {

    private final StatsService statsService;

    // Listens to the RabbitMQ queue. Message conversions to HistoricalEventEvent
    // are automatically handled by our Jackson2JsonMessageConverter configuration.
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void consumeEvent(HistoricalEventEvent event) {
        log.info("Received event from RabbitMQ queue: action={}, eventId='{}', title='{}'", 
                event.getAction(), event.getEventId(), event.getTitle());
        
        try {
            // Asynchronously recalculate and cache stats in Redis
            statsService.recalculateAndCacheStats();
            log.info("Successfully updated era statistics after event action: {}", event.getAction());
        } catch (Exception e) {
            log.error("Failed to process consumed event and update stats: " + event.getEventId(), e);
            // In enterprise environments, we would reject/dead-letter the message or retry.
            // Since this is a cache update, failing gracefully is acceptable.
        }
    }
}
