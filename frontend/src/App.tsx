import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { EventList } from './components/EventList';
import { EventForm } from './components/EventForm';
import { HatayMap } from './components/HatayMap';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthPage } from './components/AuthPage';
import { VerifyPage } from './components/VerifyPage';
import type { HistoricalEvent } from './services/api';

function AppContent() {
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [editingEvent, setEditingEvent] = useState<HistoricalEvent | null>(null);
  const [currentView, setCurrentView] = useState<'timeline' | 'map' | 'admin' | 'auth' | 'verify'>('timeline');
  const [verifyToken, setVerifyToken] = useState<string | null>(null);

  // Check if URL has e-mail verification token on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setVerifyToken(token);
      setCurrentView('verify');
      // Clean query parameters from URL bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSaved = () => {
    setEditingEvent(null);
    handleRefresh();
  };

  return (
    <div className="app-container">
      <Header />
      
      {/* Auth Status Bar */}
      <div className="auth-status-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#121624', padding: '10px 20px', border: '3px solid #000', marginBottom: '16px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px' }}>🛡️ Hoş geldin, <strong style={{ color: '#f3c63f' }}>{user.username}</strong></span>
            <span className={`role-badge role-${user.role.toLowerCase()}`} style={{ fontSize: '12px', padding: '2px 6px' }}>{user.role}</span>
          </div>
        ) : (
          <span style={{ fontSize: '14px', color: '#888' }}>👤 Giriş yapmadınız. Beğeni, yorum ve içerik eklemek için oturum açın.</span>
        )}

        {user ? (
          <button className="retro-btn secondary-btn" onClick={() => { logout(); setCurrentView('timeline'); }} style={{ padding: '4px 12px', fontSize: '12px' }}>
            🚪 ÇIKIŞ YAP
          </button>
        ) : (
          <button 
            className={`retro-btn ${currentView === 'auth' ? 'primary-btn' : 'secondary-btn'}`} 
            onClick={() => setCurrentView('auth')} 
            style={{ padding: '4px 12px', fontSize: '12px' }}
          >
            🔑 GİRİŞ YAP / HESAP AÇ
          </button>
        )}
      </div>

      {/* Retro Navigation Menu Screen Selector */}
      <div className="retro-nav-menu">
        <button 
          className={`retro-nav-btn ${currentView === 'timeline' ? 'active-nav' : ''}`}
          onClick={() => setCurrentView('timeline')}
        >
          ⏳ ZAMAN TÜNELİ
        </button>
        <button 
          className={`retro-nav-btn ${currentView === 'map' ? 'active-nav' : ''}`}
          onClick={() => setCurrentView('map')}
        >
          🗺️ HATAY TARİH HARİTASI
        </button>
        {user?.role === 'ADMIN' && (
          <button 
            className={`retro-nav-btn ${currentView === 'admin' ? 'active-nav' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            🛠️ ADMİN PANELİ
          </button>
        )}
      </div>
      
      {currentView === 'timeline' && (
        <>
          <StatsDashboard refreshTrigger={refreshTrigger} />
          
          <div className="main-content-layout">
            <EventList 
              refreshTrigger={refreshTrigger} 
              onEditEvent={(event) => setEditingEvent(event)} 
              onEventDeleted={handleRefresh}
              onOpenAuth={() => setCurrentView('auth')}
            />
            
            <EventForm 
              editingEvent={editingEvent} 
              onEventSaved={handleSaved} 
              onCancelEdit={() => setEditingEvent(null)}
              onOpenAuth={() => setCurrentView('auth')}
            />
          </div>
        </>
      )}

      {currentView === 'map' && <HatayMap />}

      {currentView === 'admin' && user?.role === 'ADMIN' && <AdminDashboard />}

      {currentView === 'auth' && (
        <AuthPage onSuccess={() => setCurrentView('timeline')} />
      )}

      {currentView === 'verify' && (
        <VerifyPage token={verifyToken || ''} onGoToLogin={() => setCurrentView('auth')} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
