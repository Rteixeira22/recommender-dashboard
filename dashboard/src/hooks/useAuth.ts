import { useState, useCallback } from 'react';

const TOKEN_STORAGE_KEY = 'recommender_admin_token';
const API_URL_STORAGE_KEY = 'recommender_api_url';

export type Environment = 'dev' | 'staging' | 'production' | 'custom';

export function useAuth() {
  const [token, setTokenState] = useState<string>(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) || ''
  );

  const [apiUrl, setApiUrlState] = useState<string>(
    () => localStorage.getItem(API_URL_STORAGE_KEY) || import.meta.env.VITE_API_URL || 'http://recommender.localhost'
  );

  const setToken = useCallback((newToken: string) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    setTokenState(newToken);
  }, []);

  const setApiUrl = useCallback((newUrl: string) => {
    if (newUrl) {
      localStorage.setItem(API_URL_STORAGE_KEY, newUrl);
    } else {
      localStorage.removeItem(API_URL_STORAGE_KEY);
    }
    setApiUrlState(newUrl);
  }, []);

  const getEnvironment = useCallback((): Environment => {
    const url = apiUrl.toLowerCase();
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return 'dev';
    }
    if (url.includes('staging') || url.includes('sermaisapp-qa.ua.pt')) {
      return 'staging';
    }
    if (url.includes('production') || url.includes('sermais.pt')) {
      return 'production';
    }
    return 'custom';
  }, [apiUrl]);

  const isAuthenticated = token.length > 0;

  return { 
    token, 
    setToken, 
    apiUrl, 
    setApiUrl, 
    environment: getEnvironment(),
    isAuthenticated 
  };
}