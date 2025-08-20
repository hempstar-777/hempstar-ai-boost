
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
  signInWithGoogle: () => Promise<any>;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🛡️ Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Store secure session data for the VIP creator
      if (session?.user && (
        session.user.email === 'creator@hempstar.ai' ||
        session.user.user_metadata?.email === 'creator@hempstar.ai' ||
        session.user.identities?.some(identity => 
          identity.identity_data?.email === 'creator@hempstar.ai'
        )
      )) {
        EncryptedStorage.setSecureItem('vip_user', JSON.stringify(session.user));
        EncryptedStorage.setSecureItem('vip_session', JSON.stringify(session));
        console.log('🛡️ VIP Creator session secured');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('🛡️ Google sign-in error:', error);
        return { error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('🛡️ Google sign-in failed:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('🛡️ Sign-in error:', error);
        return { error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('🛡️ Sign-in failed:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    // Only allow the VIP creator to sign up
    if (email !== 'creator@hempstar.ai') {
      return { error: { message: 'Registration is restricted to authorized users only' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('🛡️ Sign-up error:', error);
        return { error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('🛡️ Sign-up failed:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      EncryptedStorage.clearAllSecureItems();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('🛡️ Sign-out error:', error);
      }
    } catch (error) {
      console.error('🛡️ Sign-out failed:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
