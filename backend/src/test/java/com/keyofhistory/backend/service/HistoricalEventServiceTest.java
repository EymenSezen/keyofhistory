package com.keyofhistory.backend.service;

import com.keyofhistory.backend.exception.ResourceNotFoundException;
import com.keyofhistory.backend.model.HistoricalEvent;
import com.keyofhistory.backend.repository.HistoricalEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit Tests for HistoricalEventService (similar to xUnit + Moq tests in .NET Core)
 */
@ExtendWith(MockitoExtension.class)
public class HistoricalEventServiceTest {

    @Mock
    private HistoricalEventRepository repository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private HistoricalEventService service;

    private HistoricalEvent event1;
    private HistoricalEvent event2;

    @BeforeEach
    void setUp() {
        event1 = HistoricalEvent.builder()
                .id(1L)
                .title("Istanbul'un Fethi")
                .description("Constantinople falls to Ottoman Empire")
                .eventDate("1453-05-29")
                .era("Orta Cag")
                .location("Istanbul")
                .build();

        event2 = HistoricalEvent.builder()
                .id(2L)
                .title("Cumhuriyetin Ilani")
                .description("Proclamation of the Republic of Turkey")
                .eventDate("1923-10-29")
                .era("Yakin Cag")
                .location("Ankara")
                .build();
    }

    @Test
    void getAllEvents_ShouldReturnList() {
        // Arrange (Setup mock behavior, similar to mock.Setup(...))
        when(repository.findAll()).thenReturn(Arrays.asList(event1, event2));

        // Act
        List<HistoricalEvent> result = service.getAllEvents();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Istanbul'un Fethi");
        verify(repository, times(1)).findAll();
    }

    @Test
    void getEventById_WhenExists_ShouldReturnEvent() {
        when(repository.findById(1L)).thenReturn(Optional.of(event1));

        HistoricalEvent result = service.getEventById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Istanbul'un Fethi");
    }

    @Test
    void getEventById_WhenNotExists_ShouldThrowException() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            service.getEventById(99L);
        });
        
        verify(repository, times(1)).findById(99L);
    }

    @Test
    void createEvent_ShouldSaveAndReturnEvent() {
        // We set input event with id=null because service nullifies it
        HistoricalEvent inputEvent = HistoricalEvent.builder()
                .title("New Event")
                .description("Desc")
                .eventDate("2026")
                .era("Modern")
                .build();
                
        when(repository.save(any(HistoricalEvent.class))).thenReturn(event1);

        HistoricalEvent result = service.createEvent(inputEvent);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L); // Returns event1 mock
        verify(repository, times(1)).save(any(HistoricalEvent.class));
    }

    @Test
    void deleteEvent_WhenExists_ShouldDelete() {
        when(repository.findById(1L)).thenReturn(Optional.of(event1));

        service.deleteEvent(1L);

        verify(repository, times(1)).delete(event1);
    }
}
