import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/auth/AuthService';
import { UserResponse } from '../services/types/auth.types';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    try {
      // Token ve user bilgilerini localStorage'dan kontrol et
      if (authService.isAuthenticated()) {
        const savedUser = localStorage.getItem('admin_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Token var ama user bilgisi yok, çıkış yap
          authService.clearToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      // API response yapısına göre user bilgisini al
      const user = response.data?.data || response.data || response;
      
      // Admin yetkisi kontrolü (SUPER_ADMIN veya ADMIN)
      if (user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN')) {
        // User bilgilerini localStorage'a kaydet
        localStorage.setItem('admin_user', JSON.stringify(user));
        setUser(user);
      } else {
        // Token'ı temizle ama logout API'sine istek gönderme
        authService.clearToken();
        throw new Error('Bu dashboard\'a erişim için admin yetkisi gereklidir.');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sadece client-side temizlik yap, API isteği gönderme
      authService.clearToken();
      localStorage.removeItem('admin_user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};