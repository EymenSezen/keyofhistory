package com.keyofhistory.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Event message DTO published to RabbitMQ (similar to integration event records in .NET)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricalEventEvent implements Serializable {
    
    private Long eventId;
    private String title;
    private String era;
    private String action; // e.g. "CREATED", "UPDATED", "DELETED"
    
    @Builder.Default
    private String timestamp = LocalDateTime.now().toString();
}
