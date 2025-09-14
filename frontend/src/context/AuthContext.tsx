import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { checkAuthStatus, getAdminProfile, getUserProfile, logout } from '../services/api';

interface AuthProfile {
  full_name: string;
  email?: string;
  avatar_img?: string | null;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  profile: AuthProfile | null;
  refresh: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const load = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const status = await checkAuthStatus();
      setIsAuthenticated(Boolean(status?.authenticated));
      setIsAdmin(Boolean(status?.is_admin));

      if (status?.authenticated) {
        try {
          const data = status?.is_admin ? await getAdminProfile() : await getUserProfile();
          setProfile({
            full_name: data.full_name,
            email: data.email,
            avatar_img: data.avatar_img || null
          });
        } catch (_e) {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Re-run when token changes across tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'jwt_token') load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    isAdmin,
    isLoading,
    profile,
    refresh: load,
    signOut: () => {
      try { logout(); } catch {}
      setIsAuthenticated(false);
      setIsAdmin(false);
      setProfile(null);
    }
  }), [isAuthenticated, isAdmin, isLoading, profile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};


