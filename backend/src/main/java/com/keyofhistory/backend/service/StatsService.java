package com.keyofhistory.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.keyofhistory.backend.repository.HistoricalEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Service for caching and calculating statistics in Redis (Cache-aside / Materialized View pattern)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StatsService {

    private static final String STATS_KEY = "history:stats:era";
    private final HistoricalEventRepository repository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Gets cached stats from Redis, or recalculates on cache miss.
     */
    public Map<String, Long> getEraStats() {
        try {
            String cachedJson = redisTemplate.opsForValue().get(STATS_KEY);
            if (cachedJson != null) {
                log.info("Serving statistics from Redis Cache");
                return objectMapper.readValue(cachedJson, new TypeReference<Map<String, Long>>() {});
            }
        } catch (Exception e) {
            log.error("Failed to read statistics from Redis, falling back to database", e);
        }

        // Cache miss or Redis connection error: Recalculate from DB
        return recalculateAndCacheStats();
    }

    /**
     * Recalculates stats from PostgreSQL database and writes the results to Redis.
     */
    public Map<String, Long> recalculateAndCacheStats() {
        log.info("Recalculating event statistics from database...");
        List<Object[]> rawStats = repository.countEventsByEra();
        
        Map<String, Long> eraStats = new HashMap<>();
        for (Object[] row : rawStats) {
            String era = (String) row[0];
            Long count = (Long) row[1];
            eraStats.put(era, count);
        }

        try {
            String jsonStats = objectMapper.writeValueAsString(eraStats);
            // Cache in Redis with an absolute expiration time of 1 hour (DevOps/Cache Best Practice)
            redisTemplate.opsForValue().set(STATS_KEY, jsonStats, 1, TimeUnit.HOURS);
            log.info("Updated statistics written to Redis cache successfully");
        } catch (Exception e) {
            log.error("Failed to write updated statistics to Redis cache", e);
        }

        return eraStats;
    }
}
