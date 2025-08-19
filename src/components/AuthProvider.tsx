
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// VIP Creator mock user data
const VIP_CREATOR_USER = {
  id: 'vip-creator-2025',
  email: 'creator@hempstar.ai',
  created_at: '2025-01-01T00:00:00.000Z',
  user_metadata: { role: 'vip_creator', name: 'VIP Creator' },
  app_metadata: {},
  aud: 'authenticated',
  role: 'authenticated',
  updated_at: '2025-01-01T00:00:00.000Z'
} as User;

const VIP_CREATOR_SESSION = {
  access_token: 'vip-creator-token',
  refresh_token: 'vip-creator-refresh',
  expires_in: 999999999,
  expires_at: Date.now() / 1000 + 999999999,
  token_type: 'bearer',
  user: VIP_CREATOR_USER
} as Session;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(VIP_CREATOR_USER);
  const [session, setSession] = useState<Session | null>(VIP_CREATOR_SESSION);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Always set VIP creator as authenticated
    setUser(VIP_CREATOR_USER);
    setSession(VIP_CREATOR_SESSION);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Always return success for VIP creator
    setUser(VIP_CREATOR_USER);
    setSession(VIP_CREATOR_SESSION);
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    // Always return success for VIP creator
    setUser(VIP_CREATOR_USER);
    setSession(VIP_CREATOR_SESSION);
    return { error: null };
  };

  const signOut = async () => {
    // VIP creator cannot sign out - always stays authenticated
    console.log('VIP Creator access - sign out disabled');
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
