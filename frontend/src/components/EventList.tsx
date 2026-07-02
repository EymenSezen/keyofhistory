import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { HistoricalEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface EventListProps {
  refreshTrigger: number;
  onEditEvent: (event: HistoricalEvent) => void;
  onEventDeleted: () => void;
  onOpenAuth: () => void;
}

interface CommentRecord {
  id: number;
  content: string;
  createdAt: string;
  username: string;
}

export const EventList: React.FC<EventListProps> = ({ 
  refreshTrigger, 
  onEditEvent, 
  onEventDeleted,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  // Comment state
  const [openCommentsEventId, setOpenCommentsEventId] = useState<number | null>(null);
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

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
  }, [refreshTrigger, search, user]); // Refetch if user session changes (to fetch approved/unapproved appropriately)

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu tarihî olayı silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      await apiService.deleteEvent(id);
      onEventDeleted();
    } catch (err: any) {
      alert(err.message || 'Olay silinirken hata oluştu.');
      console.error(err);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await apiService.approveEvent(id);
      fetchEvents();
    } catch (err) {
      alert('Onaylama sırasında bir hata oluştu.');
    }
  };

  const handleLike = async (id: number) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    try {
      await apiService.likeEvent(id);
      // Update local state to instantly increment like count
      setEvents(prev => prev.map(e => e.id === id ? { ...e, likes: (e.likes || 0) + 1 } : e));
    } catch (err) {
      alert('Beğeni işlemi başarısız oldu.');
    }
  };

  const handleToggleComments = async (eventId: number) => {
    if (openCommentsEventId === eventId) {
      setOpenCommentsEventId(null);
      setComments([]);
      return;
    }

    setOpenCommentsEventId(eventId);
    setCommentsLoading(true);
    setCommentError('');
    setNewCommentText('');

    try {
      const data = await apiService.getComments(eventId);
      setComments(data);
    } catch (err) {
      setCommentError('Yorumlar yüklenemedi.');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent, eventId: number) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const newComment = await apiService.addComment(eventId, newCommentText);
      setComments(prev => [newComment, ...prev]);
      setNewCommentText('');
    } catch (err: any) {
      setCommentError(err.message || 'Yorum eklenemedi.');
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
          {events.map((event) => {
            const isOwner = user && event.author === user.username;
            const isAdmin = user && user.role === 'ADMIN';
            const canModify = isAdmin || isOwner;

            return (
              <div key={event.id} className={`event-item-card ${!event.approved ? 'pending-event-card' : ''}`}>
                <div className="event-item-side">
                  <span className="event-date-tag">{event.eventDate}</span>
                  <span className="event-era-badge">{event.era}</span>
                  
                  {/* Status / Approval badge */}
                  {!event.approved && (
                    <span className="retro-badge role-author" style={{ marginTop: '8px', fontSize: '11px', background: '#e07a5f' }}>
                      ONAY BEKLİYOR
                    </span>
                  )}
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
                  
                  {event.author && (
                    <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>
                      👤 Yazar: <span style={{ color: '#aaa', fontWeight: 'bold' }}>{event.author}</span>
                    </p>
                  )}

                  {/* Actions / Interactions Panel */}
                  <div className="event-item-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {/* Like Button */}
                    <button 
                      className={`btn-action ${user ? 'btn-edit' : 'btn-delete'}`} 
                      onClick={() => event.id && handleLike(event.id)}
                      style={{ background: user ? '#e63946' : '#232a4a', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      ❤️ {event.likes || 0} Beğeni
                    </button>

                    {/* Toggle Comments Button */}
                    <button 
                      className="btn-action btn-edit" 
                      onClick={() => event.id && handleToggleComments(event.id)}
                      style={{ background: '#457b9d', color: '#fff' }}
                    >
                      💬 Yorumlar
                    </button>

                    {/* Admin Approve Button */}
                    {isAdmin && !event.approved && (
                      <button 
                        className="btn-action primary-btn" 
                        onClick={() => event.id && handleApprove(event.id)}
                        style={{ background: '#2a9d8f', color: '#fff' }}
                      >
                        ✅ ONAYLA
                      </button>
                    )}

                    {/* Owner Modify/Delete Buttons */}
                    {canModify && (
                      <>
                        <button className="btn-action btn-edit" onClick={() => onEditEvent(event)}>
                          Düzenle
                        </button>
                        <button className="btn-action btn-delete" onClick={() => event.id && handleDelete(event.id)}>
                          Sil
                        </button>
                      </>
                    )}
                  </div>

                  {/* Toggleable Comments Section */}
                  {openCommentsEventId === event.id && (
                    <div className="retro-comments-section" style={{ marginTop: '16px', background: '#121624', padding: '12px', border: '3px solid #000' }}>
                      <h4 style={{ color: '#f3c63f', marginBottom: '8px', fontSize: '13px' }}>💬 OLAY YORUMLARI</h4>
                      
                      {/* Add comment form */}
                      {user ? (
                        <form onSubmit={(e) => event.id && handleAddComment(e, event.id)} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          <input 
                            type="text" 
                            className="retro-input" 
                            placeholder="Yorumunuzu yazın..." 
                            required
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            style={{ flex: 1, padding: '6px' }}
                          />
                          <button type="submit" className="retro-btn primary-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            YAZ
                          </button>
                        </form>
                      ) : (
                        <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                          🔑 Yorum yazmak için <span onClick={onOpenAuth} style={{ color: '#f3c63f', cursor: 'pointer', textDecoration: 'underline' }}>giriş yapın</span>.
                        </p>
                      )}

                      {commentError && <p style={{ color: '#e63946', fontSize: '11px', marginBottom: '8px' }}>⚠️ {commentError}</p>}

                      {commentsLoading ? (
                        <p style={{ fontSize: '12px', color: '#888' }}>Yorumlar yükleniyor...</p>
                      ) : comments.length === 0 ? (
                        <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>Henüz yorum yapılmamış. İlk yorumu siz yazın!</p>
                      ) : (
                        <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                          {comments.map(c => (
                            <div key={c.id} style={{ background: '#1a1f35', padding: '8px', border: '1px solid #232a4a' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                                <span style={{ color: '#f3c63f', fontWeight: 'bold' }}>{c.username}</span>
                                <span>{new Date(c.createdAt).toLocaleString('tr-TR')}</span>
                              </div>
                              <p style={{ fontSize: '12px', color: '#fff', wordBreak: 'break-word' }}>{c.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
