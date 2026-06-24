import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { HistoricalEvent } from '../services/api';

interface EventListProps {
  refreshTrigger: number;
  onEditEvent: (event: HistoricalEvent) => void;
  onEventDeleted: () => void;
}

export const EventList: React.FC<EventListProps> = ({ refreshTrigger, onEditEvent, onEventDeleted }) => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEvents(search);
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Veritabanından olay listesi yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger, search]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu tarihî olayı silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      await apiService.deleteEvent(id);
      onEventDeleted();
    } catch (err) {
      alert('Olay silinirken hata oluştu.');
      console.error(err);
    }
  };

  return (
    <section className="event-list-section">
      <div className="section-header">
        <h2>
          <svg className="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Tarihî Olaylar Listesi
        </h2>
        
        {/* Search input */}
        <div className="search-wrapper">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Olay adı veya açıklama ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading && events.length === 0 ? (
        <div className="list-loading">Olaylar yükleniyor...</div>
      ) : error ? (
        <div className="list-error">
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchEvents}>Tekrar Dene</button>
        </div>
      ) : events.length === 0 ? (
        <div className="list-empty">
          <p>Kayıt bulunamadı. Arama kriterinizi değiştirebilir veya yeni bir olay ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="events-timeline">
          {events.map((event) => (
            <div key={event.id} className="event-item-card">
              <div className="event-item-side">
                <span className="event-date-tag">{event.eventDate}</span>
                <span className="event-era-badge">{event.era}</span>
              </div>
              
              <div className="event-item-body">
                <div className="event-item-title-row">
                  <h3>{event.title}</h3>
                  {event.location && (
                    <span className="event-location">
                      <svg className="loc-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {event.location}
                    </span>
                  )}
                </div>
                <p className="event-description">{event.description}</p>
                
                <div className="event-item-actions">
                  <button className="btn-action btn-edit" onClick={() => onEditEvent(event)}>
                    Düzenle
                  </button>
                  <button className="btn-action btn-delete" onClick={() => event.id && handleDelete(event.id)}>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
