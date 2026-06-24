/**
 * API service for communicating with the Spring Boot backend.
 * Uses relative paths thanks to the Vite local dev proxy config (/api).
 */

export interface HistoricalEvent {
  id?: number;
  title: string;
  description: string;
  eventDate: string;
  era: string;
  location?: string;
}

export const API_BASE = '/api';

export const apiService = {
  /**
   * Fetch all events, optionally filtered by search query
   */
  async getEvents(search?: string): Promise<HistoricalEvent[]> {
    const url = search 
      ? `${API_BASE}/events?search=${encodeURIComponent(search)}` 
      : `${API_BASE}/events`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Fetch a single event by ID
   */
  async getEventById(id: number): Promise<HistoricalEvent> {
    const response = await fetch(`${API_BASE}/events/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch event ${id}: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Create a new historical event
   */
  async createEvent(event: HistoricalEvent): Promise<HistoricalEvent> {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to create event');
    }
    return response.json();
  },

  /**
   * Update an existing historical event
   */
  async updateEvent(id: number, event: HistoricalEvent): Promise<HistoricalEvent> {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to update event');
    }
    return response.json();
  },

  /**
   * Delete a historical event
   */
  async deleteEvent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  },

  /**
   * Fetch era statistics directly from Redis cache
   */
  async getStats(): Promise<Record<string, number>> {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }
    return response.json();
  }
};
