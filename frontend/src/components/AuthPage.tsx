import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (isLoginTab) {
      const result = await login(username, password);
      setLoading(false);
      if (result.success) {
        onSuccess();
      } else {
        setErrorMsg(result.message || 'Giriş başarısız!');
      }
    } else {
      const result = await register(username, email, password);
      setLoading(false);
      if (result.success) {
        setSuccessMsg(result.message || 'Kayıt başarılı! Lütfen aktifleştirme linki için e-postanızı kontrol edin.');
        setIsLoginTab(true);
        setPassword('');
      } else {
        setErrorMsg(result.message || 'Kayıt başarısız!');
      }
    }
  };

  return (
    <div className="auth-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', minHeight: '60vh' }}>
      <div 
        className="retro-map-card" 
        style={{ maxWidth: '480px', width: '100%', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
      >
        <div className="card-header" style={{ display: 'flex', justifyContent: 'center', padding: '15px' }}>
          <h2 style={{ fontSize: '20px' }}>{isLoginTab ? '🔑 OTURUM AÇMA GEÇİDİ' : '📝 KAYIT GEÇİDİ'}</h2>
        </div>
        
        <div className="card-body" style={{ padding: '24px' }}>
          {/* Tab Selector */}
          <div className="auth-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button 
              type="button"
              className={`pixel-tab-btn ${isLoginTab ? 'active-tab' : ''}`}
              onClick={() => { setIsLoginTab(true); setErrorMsg(''); setSuccessMsg(''); }}
              style={{ flex: 1, padding: '10px' }}
            >
              Giriş Yap
            </button>
            <button 
              type="button"
              className={`pixel-tab-btn ${!isLoginTab ? 'active-tab' : ''}`}
              onClick={() => { setIsLoginTab(false); setErrorMsg(''); setSuccessMsg(''); }}
              style={{ flex: 1, padding: '10px' }}
            >
              Kayıt Ol
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="retro-label">Kullanıcı Adı:</label>
              <input 
                type="text" 
                className="retro-input" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. gezgin31"
                disabled={loading}
                style={{ width: '100%' }}
              />
            </div>

            {!isLoginTab && (
              <div className="form-group">
                <label className="retro-label">E-Posta Adresi:</label>
                <input 
                  type="email" 
                  className="retro-input" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. eposta@example.com"
                  disabled={loading}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '11px', color: '#888', marginTop: '4px', display: 'block' }}>
                  ⚠️ Aktivasyon bağlantısı bu e-posta adresine gönderilecektir.
                </span>
              </div>
            )}

            <div className="form-group">
              <label className="retro-label">Şifre:</label>
              <input 
                type="password" 
                className="retro-input" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                disabled={loading}
                style={{ width: '100%' }}
              />
            </div>

            {errorMsg && (
              <div className="retro-alert error-alert" style={{ fontSize: '12px', margin: '4px 0' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="retro-alert success-alert" style={{ fontSize: '12px', margin: '4px 0' }}>
                ✅ {successMsg}
              </div>
            )}

            <div className="retro-divider" style={{ margin: '12px 0' }}></div>

            <button type="submit" className="retro-btn primary-btn" disabled={loading} style={{ width: '100%', padding: '12px' }}>
              {loading ? 'YÜKLENİYOR...' : isLoginTab ? '🔑 GİRİŞ KAPISINI AÇ' : '💾 YENİ KARAKTER OLUŞTUR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
