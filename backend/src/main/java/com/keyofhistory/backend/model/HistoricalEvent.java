package com.keyofhistory.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Historical Event JPA Entity (similar to a DbSet entity class in EF Core)
 */
@Entity
@Table(name = "historical_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricalEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    @Column(nullable = false, length = 100)
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 1000, message = "Description can be up to 1000 characters")
    @Column(nullable = false, length = 1000)
    private String description;

    @NotBlank(message = "Event date cannot be blank")
    @Column(name = "event_date", nullable = false)
    private String eventDate; // Using String to allow fuzzy dates like "1453" or "M.Ö. 3000"

    @NotBlank(message = "Era cannot be blank")
    @Column(nullable = false)
    private String era; // e.g., "Antik Çağ", "Orta Çağ", "Yakın Çağ"

    @Column(length = 100)
    private String location;
}
