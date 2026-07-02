import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  username: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        const loggedInUser: User = {
          username: data.username,
          role: data.role,
          token: data.token,
        };
        setUser(loggedInUser);
        localStorage.setItem('user_session', JSON.stringify(loggedInUser));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Giriş yapılamadı!' };
      }
    } catch (err) {
      return { success: false, message: 'Sunucu bağlantı hatası!' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Kayıt yapılamadı!' };
      }
    } catch (err) {
      return { success: false, message: 'Sunucu bağlantı hatası!' };
    }
  };

  const logout = () => {
    if (user) {
      // Best effort notify backend of logout
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      }).catch(() => {});
    }
    setUser(null);
    localStorage.removeItem('user_session');
  };

  // Helper fetch function that attaches active token automatically
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (user?.token) {
      headers.set('Authorization', `Bearer ${user.token}`);
    }
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
