import React, { useEffect, useState } from 'react';

interface VerifyPageProps {
  token: string;
  onGoToLogin: () => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ token, onGoToLogin }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      try {
        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'E-posta adresiniz başarıyla doğrulandı!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Doğrulama başarısız oldu.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Sunucu bağlantı hatası oluştu.');
      }
    };

    if (token) {
      performVerification();
    } else {
      setStatus('error');
      setMessage('Aktivasyon token\'ı bulunamadı.');
    }
  }, [token]);

  return (
    <div className="verify-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', minHeight: '60vh' }}>
      <div className="retro-map-card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div className="card-header" style={{ padding: '15px' }}>
          <h2>📬 E-POSTA DOĞRULAMA GEÇİDİ</h2>
        </div>
        <div className="card-body" style={{ padding: '30px' }}>
          
          {status === 'loading' && (
            <div className="verify-loading">
              <div className="loading-retro" style={{ fontSize: '18px', color: '#f3c63f', marginBottom: '16px' }}>
                ⏳ HESAP AKTİFLEŞTİRİLİYOR...
              </div>
              <p style={{ color: '#888' }}>Lütfen e-posta doğrulama anahtarı kontrol edilirken bekleyin.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="verify-success">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ color: '#2a9d8f', fontSize: '18px', marginBottom: '12px' }}>BAĞLANTI BAŞARILI!</h3>
              <div className="retro-alert success-alert" style={{ marginBottom: '24px' }}>
                {message}
              </div>
              <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
                Hesabınız başarıyla aktifleştirildi. Artık giriş yapıp yorum yazabilir, beğeni atabilir ve içerik paylaşabilirsiniz.
              </p>
              <button className="retro-btn primary-btn" onClick={onGoToLogin} style={{ padding: '12px 24px', width: '100%' }}>
                🔑 GİRİŞ YAPMA EKRANINA GİT
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="verify-error">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
              <h3 style={{ color: '#e63946', fontSize: '18px', marginBottom: '12px' }}>AKTİVASYON HATASI!</h3>
              <div className="retro-alert error-alert" style={{ marginBottom: '24px' }}>
                ⚠️ {message}
              </div>
              <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
                Kullandığınız bağlantı geçersiz, süresi dolmuş veya hesap zaten doğrulanmış olabilir.
              </p>
              <button className="retro-btn secondary-btn" onClick={onGoToLogin} style={{ padding: '12px 24px', width: '100%' }}>
                🏠 GİRİŞ EKRANINA DÖN
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
