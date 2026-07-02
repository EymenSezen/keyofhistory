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
  approved?: boolean;
  likes?: number;
  author?: string;
}

export const API_BASE = '/api';

const getAuthHeaders = (): Record<string, string> => {
  const savedUser = localStorage.getItem('user_session');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user && user.token) {
        return { 'Authorization': `Bearer ${user.token}` };
      }
    } catch (e) {}
  }
  return {};
};

export const apiService = {
  /**
   * Fetch all events, optionally filtered by search query
   */
  async getEvents(search?: string): Promise<HistoricalEvent[]> {
    const url = search 
      ? `${API_BASE}/events?search=${encodeURIComponent(search)}` 
      : `${API_BASE}/events`;
    
    const response = await fetch(url, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Fetch a single event by ID
   */
  async getEventById(id: number): Promise<HistoricalEvent> {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      headers: { ...getAuthHeaders() }
    });
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
        ...getAuthHeaders()
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
        ...getAuthHeaders()
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
      headers: { ...getAuthHeaders() }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  },

  /**
   * Approve a historical event (admin only)
   */
  async approveEvent(id: number): Promise<HistoricalEvent> {
    const response = await fetch(`${API_BASE}/events/${id}/approve`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) {
      throw new Error('Failed to approve event');
    }
    return response.json();
  },

  /**
   * Like a historical event
   */
  async likeEvent(id: number): Promise<HistoricalEvent> {
    const response = await fetch(`${API_BASE}/events/${id}/like`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) {
      throw new Error('Failed to like event');
    }
    return response.json();
  },

  /**
   * Fetch comments list for an event
   */
  async getComments(eventId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE}/events/${eventId}/comments`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return response.json();
  },

  /**
   * Add a new comment to an event
   */
  async addComment(eventId: number, content: string): Promise<any> {
    const response = await fetch(`${API_BASE}/events/${eventId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ content })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to add comment');
    }
    return response.json();
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
