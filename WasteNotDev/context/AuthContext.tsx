// Authentication context for managing user session state (US14).
// Stores the logged-in user's info and token so all screens can access it.
// Provides login and logout functions to the rest of the app.
// Uses expo-secure-store to persist the token between app restarts (Expo, 2026).
// React createContext: (React Native, 2025)
// React useContext: (React Native, 2025)

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/services/api';
import type { LoginResponse } from '@/services/types';

interface AuthContextType {
  user: LoginResponse | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On app start, check if there is a saved token and user info
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        const storedUser = await SecureStore.getItemAsync('auth_user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser) as LoginResponse;
          setToken(storedToken);
          setUser(parsedUser);

          // Setting the token on the api instance so all future requests include it
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (err) {
        console.error('Error loading stored auth:', err);
      } finally {
        setLoading(false);
      }
    };

    void loadStoredAuth();
  }, []);

  const login = async (data: LoginResponse) => {
    // Saving to secure storage so the user stays logged in between app restarts
    await SecureStore.setItemAsync('auth_token', data.access_token);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(data));

    // Setting the token on the api instance
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

    setToken(data.access_token);
    setUser(data);
  };

  const logout = async () => {
    // Clearing secure storage
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');

    // Removing the token from the api instance
    delete api.defaults.headers.common['Authorization'];

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
