import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { HistoricalEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface EventFormProps {
  editingEvent: HistoricalEvent | null;
  onEventSaved: () => void;
  onCancelEdit: () => void;
  onOpenAuth: () => void;
}

const INITIAL_FORM_STATE: HistoricalEvent = {
  title: '',
  description: '',
  eventDate: '',
  era: 'Antik Çağ',
  location: '',
};

export const EventForm: React.FC<EventFormProps> = ({ 
  editingEvent, 
  onEventSaved, 
  onCancelEdit,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<HistoricalEvent>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingEvent) {
      setFormData(editingEvent);
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setValidationErrors({});
  }, [editingEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Başlık boş bırakılamaz';
    else if (formData.title.length < 3) errors.title = 'Başlık en az 3 karakter olmalıdır';
    
    if (!formData.description.trim()) errors.description = 'Açıklama boş bırakılamaz';
    if (!formData.eventDate.trim()) errors.eventDate = 'Tarih boş bırakılamaz';
    if (!formData.era) errors.era = 'Dönem seçilmelidir';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (formData.id) {
        // Update Event
        await apiService.updateEvent(formData.id, formData);
      } else {
        // Create Event
        await apiService.createEvent(formData);
      }
      
      setFormData(INITIAL_FORM_STATE);
      onEventSaved();
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('Validation')) {
        alert('Doğrulama hatası! Lütfen girdileri kontrol edin.');
      } else {
        alert('Kayıt sırasında bir hata oluştu: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Render form helper depending on user role
  if (!user) {
    return (
      <section className="event-form-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <p style={{ color: '#888', marginBottom: '16px' }}>🔑 Yeni tarihî olaylar eklemek veya düzenlemek için oturum açmalısınız.</p>
        <button className="retro-btn primary-btn" onClick={onOpenAuth}>
          Giriş Yap / Üye Ol
        </button>
      </section>
    );
  }

  const canWrite = user.role === 'ADMIN' || user.role === 'AUTHOR';
  if (!canWrite) {
    return (
      <section className="event-form-section" style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#e07a5f' }}>⚠️ Rolünüz (USER) yeni olay eklemeye izin vermemektedir.</p>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>Yazar veya yönetici rolü talep edebilirsiniz.</p>
      </section>
    );
  }

  return (
    <section className="event-form-section">
      <div className="section-header">
        <h2>
          <svg className="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          {formData.id ? 'Tarihî Olayı Düzenle' : 'Yeni Tarihî Olay Ekle'}
        </h2>
      </div>

      {user.role === 'AUTHOR' && !formData.id && (
        <div className="retro-alert info-alert" style={{ margin: '8px 0', fontSize: '11px', padding: '6px' }}>
          📝 Yazar olarak eklediğiniz olaylar yönetici onayından sonra yayınlanacaktır.
        </div>
      )}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-row-2">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Olay Başlığı*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Örn: Hatay Devleti Kuruldu"
              className={validationErrors.title ? 'input-error' : ''}
              disabled={loading}
            />
            {validationErrors.title && <span className="error-message">{validationErrors.title}</span>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="eventDate">Tarih*</label>
            <input
              type="text"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              placeholder="Örn: 1938-09-07"
              className={validationErrors.eventDate ? 'input-error' : ''}
              disabled={loading}
            />
            {validationErrors.eventDate && <span className="error-message">{validationErrors.eventDate}</span>}
          </div>
        </div>

        <div className="form-row-2">
          {/* Era */}
          <div className="form-group">
            <label htmlFor="era">Tarihî Dönem*</label>
            <select
              id="era"
              name="era"
              value={formData.era}
              onChange={handleChange}
              className={validationErrors.era ? 'input-error' : ''}
              disabled={loading}
            >
              <option value="Antik Çağ">Antik Çağ</option>
              <option value="Orta Çağ">Orta Çağ</option>
              <option value="Yeni Çağ">Yeni Çağ</option>
              <option value="Yakın Çağ">Yakın Çağ</option>
            </select>
            {validationErrors.era && <span className="error-message">{validationErrors.era}</span>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Konum / Şehir</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="Örn: Antakya"
              disabled={loading}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Olay Açıklaması*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Olayın detayları, önemi ve tarihî etkileri..."
            rows={4}
            className={validationErrors.description ? 'input-error' : ''}
            disabled={loading}
          />
          {validationErrors.description && <span className="error-message">{validationErrors.description}</span>}
        </div>

        <div className="form-actions">
          {formData.id && (
            <button type="button" className="btn-cancel" onClick={onCancelEdit} disabled={loading}>
              İptal
            </button>
          )}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Kaydediliyor...' : formData.id ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </section>
  );
};
