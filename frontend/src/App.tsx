import { useState } from 'react';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { EventList } from './components/EventList';
import { EventForm } from './components/EventForm';
import { HatayMap } from './components/HatayMap';
import type { HistoricalEvent } from './services/api';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [editingEvent, setEditingEvent] = useState<HistoricalEvent | null>(null);
  const [currentView, setCurrentView] = useState<'timeline' | 'map'>('timeline');

  const handleRefresh = () => {
    // Incrementing trigger forces child components to re-run their useEffect hooks
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSaved = () => {
    setEditingEvent(null);
    handleRefresh();
  };

  return (
    <div className="app-container">
      <Header />
      
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
      </div>
      
      {currentView === 'timeline' ? (
        <>
          {/* Redis-backed Stats Counter Cards */}
          <StatsDashboard refreshTrigger={refreshTrigger} />
          
          <div className="main-content-layout">
            {/* PostgreSQL-backed Event Timeline */}
            <EventList 
              refreshTrigger={refreshTrigger} 
              onEditEvent={(event) => setEditingEvent(event)} 
              onEventDeleted={handleRefresh}
            />
            
            {/* Form to submit events and trigger RabbitMQ messages */}
            <EventForm 
              editingEvent={editingEvent} 
              onEventSaved={handleSaved} 
              onCancelEdit={() => setEditingEvent(null)}
            />
          </div>
        </>
      ) : (
        /* Interactive SVG Hatay Map View */
        <HatayMap />
      )}
    </div>
  );
}

export default App;
