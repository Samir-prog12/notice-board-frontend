import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getTokenExpiry, isTokenExpired } from '../utils/jwt.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'auth';

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || isTokenExpired(parsed.token)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth);

  const login = useCallback((data) => {
    const next = {
      token: data.token,
      username: data.username,
      roles: Array.from(data.roles || []),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  // The axios interceptor fires this event when the server returns 401.
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  // Log out automatically when the token expires.
  useEffect(() => {
    if (!auth) return undefined;
    const exp = getTokenExpiry(auth.token);
    if (!exp) return undefined;
    const remaining = exp - Date.now();
    if (remaining <= 0) {
      logout();
      return undefined;
    }
    const timer = setTimeout(logout, Math.min(remaining, 2147483647));
    return () => clearTimeout(timer);
  }, [auth, logout]);

  const value = useMemo(
    () => ({
      user: auth,
      isAuthenticated: Boolean(auth),
      isAdmin: Boolean(auth?.roles.includes('ROLE_ADMIN')),
      login,
      logout,
    }),
    [auth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
