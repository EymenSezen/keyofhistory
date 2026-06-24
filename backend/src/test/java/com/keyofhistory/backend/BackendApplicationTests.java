package com.keyofhistory.backend;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.test.context.ActiveProfiles;

/**
 * Integration Test to verify Spring Application Context loads (similar to WebApplicationFactory integration tests in .NET)
 * Uses the "h2" profile to use the in-memory database for testing without needing external services.
 * Mocks RabbitMQ and Redis connection factories so context loads without running external brokers.
 */
@SpringBootTest
@ActiveProfiles("h2")
class BackendApplicationTests {

	@MockBean
	private ConnectionFactory connectionFactory;

	@MockBean
	private RedisConnectionFactory redisConnectionFactory;

	@Test
	void contextLoads() {
		// Verifies that the spring context boots up successfully.
	}

}
