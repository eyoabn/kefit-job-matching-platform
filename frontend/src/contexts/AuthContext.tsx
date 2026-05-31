import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  setAccessToken,
  getAccessToken,
  isAuthenticated,
  refreshToken,
} from '@/services/auth';

interface AuthContextType {
  user: User | null;
  role: User['role'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { email: string; password: string; name: string; role: 'Client' | 'Freelancer' }) => Promise<User>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const silentRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const newToken = await refreshToken();
      if (newToken) {
        const userData = await getCurrentUser();
        setUser(userData);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = getAccessToken();
    if (token && isAuthenticated()) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        setAccessToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<User> => {
    await apiLogin(email, password);
    const userData = await getCurrentUser();
    setUser(userData);
    return userData;
  };

  const register = async (data: { email: string; password: string; name: string; role: 'Client' | 'Freelancer' }): Promise<User> => {
    await apiRegister(data);
    const userData = await getCurrentUser();
    setUser(userData);
    return userData;
  };

  const logout = async (): Promise<void> => {
    try {
      await apiLogout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const handleRefreshToken = async (): Promise<boolean> => {
    return silentRefresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken: handleRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};