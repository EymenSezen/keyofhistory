import { useState } from 'react';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { EventList } from './components/EventList';
import { EventForm } from './components/EventForm';
import type { HistoricalEvent } from './services/api';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [editingEvent, setEditingEvent] = useState<HistoricalEvent | null>(null);

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
    </div>
  );
}

export default App;
