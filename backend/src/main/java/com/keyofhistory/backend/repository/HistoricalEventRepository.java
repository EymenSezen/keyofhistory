package com.keyofhistory.backend.repository;

import com.keyofhistory.backend.model.HistoricalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository (similar to EF Core's DbSet or Generic Repository pattern)
 * Spring automatically implements this interface at runtime.
 */
@Repository
public interface HistoricalEventRepository extends JpaRepository<HistoricalEvent, Long> {
    
    // Custom query method generated automatically by Spring Data name parsing
    List<HistoricalEvent> findByEra(String era);
    
    // Search query method
    List<HistoricalEvent> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    // Custom JPQL query to group and count events by era for statistics (similar to LINQ GroupBy in .NET)
    @Query("SELECT e.era, COUNT(e) FROM HistoricalEvent e GROUP BY e.era")
    List<Object[]> countEventsByEra();
}
