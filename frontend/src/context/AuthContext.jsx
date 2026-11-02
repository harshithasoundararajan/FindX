import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login as loginRequest, register as registerRequest } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('findx_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('findx_user');
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    localStorage.setItem('findx_token', data.token);
    const sessionUser = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role
    };
    localStorage.setItem('findx_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const login = useCallback(async (credentials) => {
    const res = await loginRequest(credentials);
    return persistSession(res.data);
  }, []);

  const register = useCallback(async (payload) => {
    const res = await registerRequest(payload);
    return persistSession(res.data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('findx_token');
    localStorage.removeItem('findx_user');
    setUser(null);
  }, []);

  const value = { user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
