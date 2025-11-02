import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import apiClient, { removeStoredTokens, setAuthHandlers, updateStoredTokens } from '../lib/apiClient.js';
import { getStoredTokens } from '../lib/tokenStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    removeStoredTokens();
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const { data } = await apiClient.get('/auth/me');
    setUser(data.user);
    return data.user;
  }, []);

  const refreshTokens = useCallback(async () => {
    const stored = getStoredTokens();
    if (!stored?.refreshToken) throw new Error('Missing refresh token');
    const { data } = await apiClient.post('/auth/refresh', { token: stored.refreshToken });
    const nextTokens = { ...stored, ...data };
    updateStoredTokens(nextTokens);
    return nextTokens;
  }, []);

  useEffect(() => {
    setAuthHandlers({ refresh: refreshTokens, logout: handleLogout });
  }, [handleLogout, refreshTokens]);

  useEffect(() => {
    const tokens = getStoredTokens();
    if (!tokens?.accessToken) {
      setLoading(false);
      return;
    }

    fetchCurrentUser()
      .catch(() => {
        handleLogout();
      })
      .finally(() => setLoading(false));
  }, [fetchCurrentUser, handleLogout]);

  const login = useCallback(
    async ({ email, password }) => {
      const { data } = await apiClient.post('/auth/login', { email, password });
      updateStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setUser(data.user);
      return data.user;
    },
    []
  );

  const register = useCallback(async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload);
    updateStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      hasRole: (roles) => (Array.isArray(roles) ? roles.includes(user?.role) : user?.role === roles),
      login,
      register,
      logout: handleLogout,
      loading,
      refreshUser: fetchCurrentUser,
    }),
    [user, login, register, handleLogout, loading, fetchCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


