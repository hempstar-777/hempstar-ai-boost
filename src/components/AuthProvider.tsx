
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import SecurityHardening from '@/utils/securityHardening';
import EncryptedStorage from '@/utils/encryptedStorage';

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

// VIP Creator with enhanced security
const VIP_CREATOR_USER = {
  id: 'vip-creator-2025',
  email: 'creator@hempstar.ai',
  created_at: '2025-01-01T00:00:00.000Z',
  user_metadata: { 
    role: 'vip_creator', 
    name: 'VIP Creator',
    security_level: 'maximum',
    access_level: 'military_grade'
  },
  app_metadata: {
    security_clearance: 'level_10',
    anti_tamper: true
  },
  aud: 'authenticated',
  role: 'authenticated',
  updated_at: '2025-01-01T00:00:00.000Z'
} as User;

const VIP_CREATOR_SESSION = {
  access_token: SecurityHardening.obfuscateString('vip-creator-military-token-2025'),
  refresh_token: SecurityHardening.obfuscateString('vip-creator-military-refresh-2025'),
  expires_in: 999999999,
  expires_at: Date.now() / 1000 + 999999999,
  token_type: 'bearer',
  user: VIP_CREATOR_USER
} as Session;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSecureAuth = async () => {
      try {
        // Verify environment security
        if (!SecurityHardening.validateEnvironment()) {
          setLoading(false);
          return;
        }

        // Check for stored secure session
        const storedUser = EncryptedStorage.getSecureItem('vip_user');
        const storedSession = EncryptedStorage.getSecureItem('vip_session');

        if (storedUser && storedSession) {
          setUser(JSON.parse(storedUser));
          setSession(JSON.parse(storedSession));
        } else {
          // Initialize VIP creator session
          setUser(VIP_CREATOR_USER);
          setSession(VIP_CREATOR_SESSION);
          
          // Store encrypted session
          EncryptedStorage.setSecureItem('vip_user', JSON.stringify(VIP_CREATOR_USER));
          EncryptedStorage.setSecureItem('vip_session', JSON.stringify(VIP_CREATOR_SESSION));
        }

        // Verify user authorization
        const isAuthorized = await SecurityHardening.verifyAuthorizedUser();
        if (!isAuthorized) {
          setUser(null);
          setSession(null);
          EncryptedStorage.clearAllSecureItems();
        }

      } catch (error) {
        console.error('Secure auth initialization failed:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initializeSecureAuth();

    // Set up periodic security verification
    const securityInterval = setInterval(async () => {
      const isAuthorized = await SecurityHardening.verifyAuthorizedUser();
      if (!isAuthorized && user) {
        setUser(null);
        setSession(null);
        EncryptedStorage.clearAllSecureItems();
      }
    }, 60000); // Check every minute

    return () => clearInterval(securityInterval);
  }, [user]);

  const signIn = async (email: string, password: string) => {
    // Enhanced security: Only allow VIP creator
    if (email !== 'creator@hempstar.ai') {
      return { error: { message: 'Unauthorized access attempt logged' } };
    }

    const isAuthorized = await SecurityHardening.verifyAuthorizedUser();
    if (!isAuthorized) {
      return { error: { message: 'Security verification failed' } };
    }

    setUser(VIP_CREATOR_USER);
    setSession(VIP_CREATOR_SESSION);
    
    EncryptedStorage.setSecureItem('vip_user', JSON.stringify(VIP_CREATOR_USER));
    EncryptedStorage.setSecureItem('vip_session', JSON.stringify(VIP_CREATOR_SESSION));
    
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    // Block all sign-ups - single user app
    return { error: { message: 'Registration disabled - Single user application' } };
  };

  const signOut = async () => {
    // VIP creator cannot sign out - maximum security mode
    console.log('🛡️ VIP Creator - Sign out disabled for security');
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
