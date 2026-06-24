import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface StatsDashboardProps {
  refreshTrigger: number;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ refreshTrigger }) => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string>('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiService.getStats();
      setStats(data);
      setLastFetched(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('İstatistikler şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const totalEvents = Object.values(stats).reduce((a, b) => a + b, 0);

  // Helper to determine background glow and color based on Era name
  const getEraStyleClass = (era: string) => {
    const eraLower = era.toLowerCase();
    if (eraLower.includes('antik')) return 'era-card-antik';
    if (eraLower.includes('orta')) return 'era-card-orta';
    if (eraLower.includes('yeni')) return 'era-card-yeni';
    if (eraLower.includes('yakın') || eraLower.includes('yakin')) return 'era-card-yakin';
    return 'era-card-default';
  };

  return (
    <section className="stats-dashboard">
      <div className="section-header">
        <h2>
          <svg className="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Dönem İstatistikleri
        </h2>
      </div>

      {loading && Object.keys(stats).length === 0 ? (
        <div className="dashboard-loading">İstatistikler yükleniyor...</div>
      ) : error ? (
        <div className="dashboard-error">
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchStats}>Tekrar Dene</button>
        </div>
      ) : (
        <div className="stats-grid">
          {/* Main Total Card */}
          <div className="stat-card total-card">
            <div className="stat-info">
              <h3>Toplam Tarihî Olay</h3>
              <p className="stat-number">{totalEvents}</p>
            </div>
            <div className="stat-footer-text">Genel Toplam</div>
          </div>

          {/* Dynamic Era Cards */}
          {Object.keys(stats).length === 0 ? (
            <div className="empty-stats-card">
              <p>Henüz kayıt bulunmamaktadır. Aşağıdan yeni olaylar ekleyin!</p>
            </div>
          ) : (
            Object.entries(stats).map(([era, count]) => (
              <div key={era} className={`stat-card ${getEraStyleClass(era)}`}>
                <div className="stat-info">
                  <h3>{era}</h3>
                  <p className="stat-number">{count}</p>
                </div>
                <div className="stat-footer-text">Etkinlik Adedi</div>
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="stats-meta">
        <span>Son Güncelleme: <strong>{lastFetched || 'Yüklenmedi'}</strong></span>
        <button className="btn-refresh-stats" onClick={fetchStats} title="Verileri el ile tazele">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-refresh">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          Yenile
        </button>
      </div>
    </section>
  );
};
