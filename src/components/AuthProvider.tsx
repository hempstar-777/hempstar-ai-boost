
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import SecurityHardening from '@/utils/securityHardening';
import EncryptedStorage from '@/utils/encryptedStorage';
import { isVipUser, isAllowedToSignUp } from '@/utils/vipAccess';

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
    console.log('🛡️ AuthProvider initializing...');
    
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🛡️ Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Only set loading to false after we've processed the auth state
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setLoading(false);
      }

      // Store secure session data for VIP users
      if (session?.user && isVipUser(session.user)) {
        setTimeout(() => {
          EncryptedStorage.setSecureItem('vip_user', JSON.stringify(session.user));
          EncryptedStorage.setSecureItem('vip_session', JSON.stringify(session));
          console.log('🛡️ VIP session secured for:', session.user.email);
        }, 0);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('🛡️ Error getting session:', error);
      }
      console.log('🛡️ Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      // Don't set loading to false here - let the auth state change handler do it
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('🛡️ Initiating Google sign-in...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('🛡️ Google sign-in error:', error);
        return { error };
      }
      
      console.log('🛡️ Google sign-in initiated successfully');
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
    // Only allow VIP users to sign up
    if (!isAllowedToSignUp(email)) {
      return { error: { message: 'Registration is restricted to authorized users only' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
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
      console.log('🛡️ Signing out...');
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
