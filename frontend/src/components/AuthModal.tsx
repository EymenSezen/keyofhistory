import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isLoginTab) {
      const result = await login(username, password);
      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.message || 'Giriş başarısız!');
      }
    } else {
      const result = await register(username, email, password);
      if (result.success) {
        setSuccessMsg('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setIsLoginTab(true);
        setPassword('');
      } else {
        setErrorMsg(result.message || 'Kayıt başarısız!');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="retro-modal-box" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '400px', width: '90%' }}
      >
        <div className="modal-header">
          <h2>{isLoginTab ? '🔐 GİRİŞ YAP' : '📝 KAYIT OL'}</h2>
          <button className="close-btn" onClick={onClose}>❌</button>
        </div>

        <div className="retro-divider" style={{ margin: '12px 0' }}></div>

        {/* Tab Buttons */}
        <div className="auth-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button 
            type="button"
            className={`pixel-tab-btn ${isLoginTab ? 'active-tab' : ''}`}
            onClick={() => { setIsLoginTab(true); setErrorMsg(''); setSuccessMsg(''); }}
            style={{ flex: 1 }}
          >
            Giriş Yap
          </button>
          <button 
            type="button"
            className={`pixel-tab-btn ${!isLoginTab ? 'active-tab' : ''}`}
            onClick={() => { setIsLoginTab(false); setErrorMsg(''); setSuccessMsg(''); }}
            style={{ flex: 1 }}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div className="form-group">
            <label className="retro-label">Kullanıcı Adı:</label>
            <input 
              type="text" 
              className="retro-input" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. antikgezgin"
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
                placeholder="e.g. mail@example.com"
              />
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

          <div className="retro-divider" style={{ margin: '8px 0' }}></div>

          <button type="submit" className="retro-btn primary-btn">
            {isLoginTab ? '🔑 OTURUM AÇ' : '💾 HESAP OLUŞTUR'}
          </button>
        </form>
      </div>
    </div>
  );
};
