import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface UserRecord {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, authFetch } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await authFetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError('Kullanıcı listesi yüklenemedi! Yetki yetersiz.');
      }
    } catch (err) {
      setError('Sunucu bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    setError('');
    setStatusMsg('');
    try {
      const res = await authFetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg('Kullanıcı rolü başarıyla güncellendi!');
        fetchUsers(); // Refresh list
      } else {
        setError(data.message || 'Rol güncellenemedi.');
      }
    } catch (err) {
      setError('İşlem başarısız oldu.');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="retro-alert error-alert" style={{ margin: '20px auto', maxWidth: '600px' }}>
        🛑 ERİŞİM ENGELLENDİ: Bu sayfaya yalnızca Yöneticiler (ADMIN) erişebilir.
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container" style={{ maxWidth: '800px', margin: '20px auto' }}>
      <div className="section-header">
        <h2>🛠️ YÖNETİCİ KONTROL PANELİ</h2>
        <span className="logo-badge" style={{ margin: 0 }}>Rol Yönetimi Ledger'ı</span>
      </div>

      <div className="retro-map-card" style={{ marginTop: '16px' }}>
        <div className="card-header">
          <h3>👥 SİSTEM KULLANICILARI</h3>
        </div>
        <div className="card-body">
          {error && <div className="retro-alert error-alert" style={{ marginBottom: '12px' }}>⚠️ {error}</div>}
          {statusMsg && <div className="retro-alert success-alert" style={{ marginBottom: '12px' }}>✅ {statusMsg}</div>}

          {loading ? (
            <div className="loading-retro">BİLGİLER YÜKLENİYOR...</div>
          ) : (
            <div className="retro-table-wrapper" style={{ overflowX: 'auto' }}>
              <table className="retro-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#121624', borderBottom: '4px solid #000' }}>
                    <th style={{ padding: '10px' }}>Kullanıcı Adı</th>
                    <th style={{ padding: '10px' }}>E-Posta</th>
                    <th style={{ padding: '10px' }}>Mevcut Rol</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Rol Düzenle</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr 
                      key={u.id} 
                      style={{ 
                        borderBottom: '2px solid #232a4a', 
                        background: u.username === user.username ? '#2a2212' : 'transparent' 
                      }}
                    >
                      <td style={{ padding: '10px', fontFamily: 'monospace' }}>
                        {u.username} {u.username === user.username && '👑 (Sen)'}
                      </td>
                      <td style={{ padding: '10px', fontSize: '14px' }}>{u.email}</td>
                      <td style={{ padding: '10px' }}>
                        <span className={`role-badge role-${u.role.toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        {u.username === user.username ? (
                          <span style={{ fontSize: '12px', color: '#888' }}>Kendini düzenleyemezsin</span>
                        ) : (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleRoleChange(u.id, 'USER')}
                              className={`retro-btn ${u.role === 'USER' ? 'primary-btn' : 'secondary-btn'}`}
                              style={{ padding: '3px 8px', fontSize: '12px' }}
                            >
                              USER
                            </button>
                            <button
                              onClick={() => handleRoleChange(u.id, 'AUTHOR')}
                              className={`retro-btn ${u.role === 'AUTHOR' ? 'primary-btn' : 'secondary-btn'}`}
                              style={{ padding: '3px 8px', fontSize: '12px' }}
                            >
                              YAZAR
                            </button>
                            <button
                              onClick={() => handleRoleChange(u.id, 'ADMIN')}
                              className={`retro-btn ${u.role === 'ADMIN' ? 'primary-btn' : 'secondary-btn'}`}
                              style={{ padding: '3px 8px', fontSize: '12px' }}
                            >
                              ADMIN
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
