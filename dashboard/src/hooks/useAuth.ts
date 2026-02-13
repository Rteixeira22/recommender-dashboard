import { useState, useCallback } from 'react';

const STORAGE_KEY = 'recommender_admin_token';

export function useAuth() {
  const [token, setTokenState] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) || ''
  );

  const setToken = useCallback((newToken: string) => {
    if (newToken) {
      localStorage.setItem(STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setTokenState(newToken);
  }, []);

  const isAuthenticated = token.length > 0;

  return { token, setToken, isAuthenticated };
}
