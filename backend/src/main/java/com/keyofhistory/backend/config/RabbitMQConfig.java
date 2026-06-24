package com.keyofhistory.backend.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ Configuration (similar to MassTransit / RabbitMQ Bus Configuration in .NET Core)
 * Declares the necessary exchanges, queues, bindings, and serializer converters.
 */
@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "history.event.exchange";
    public static final String QUEUE_NAME = "history.event.queue";
    public static final String ROUTING_KEY = "history.event.created";

    // 1. Declare the Topic Exchange
    @Bean
    public TopicExchange eventExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    // 2. Declare the Queue
    @Bean
    public Queue eventQueue() {
        // durable = true, exclusive = false, autoDelete = false
        return new Queue(QUEUE_NAME, true);
    }

    // 3. Bind the Queue to the Exchange via the Routing Key
    @Bean
    public Binding binding(Queue eventQueue, TopicExchange eventExchange) {
        return BindingBuilder.bind(eventQueue).to(eventExchange).with(ROUTING_KEY);
    }

    // 4. Configure JSON Message Converter (Crucial DevOps/Architectural Best Practice)
    // Ensures Java Objects are serialized to standard JSON strings rather than binary Java streams.
    // This allows heterogeneous services (e.g. Go, Node.js, .NET) to consume messages.
    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
