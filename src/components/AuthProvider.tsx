
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import SecurityHardening from '@/utils/securityHardening';
import EncryptedStorage from '@/utils/encryptedStorage';
import { isVipUser, isAllowedToSignUp, validateUserSession } from '@/utils/vipAccess';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isSecurityVerified: boolean;
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
  const [isSecurityVerified, setIsSecurityVerified] = useState(false);

  useEffect(() => {
    console.log('🛡️ AuthProvider initializing with enhanced security...');
    
    // Initialize security first
    SecurityHardening.initializeSecuritySuite();
    
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🛡️ Auth state changed:', event, session?.user?.email);
      
      try {
        if (session?.user) {
          // Enhanced security validation
          if (!validateUserSession(session.user)) {
            console.error('🛡️ Invalid session detected, signing out');
            await supabase.auth.signOut();
            return;
          }

          // Check if user is VIP
          const isVip = isVipUser(session.user);
          if (!isVip) {
            console.warn('🛡️ Non-VIP user detected, access denied');
            setIsSecurityVerified(false);
            await supabase.auth.signOut();
            return;
          }

          // Check for account lockout
          if (session.user.email && SecurityHardening.isUserLockedOut(session.user.email)) {
            console.error('🛡️ Account is locked out');
            await supabase.auth.signOut();
            return;
          }

          setUser(session.user);
          setSession(session);
          setIsSecurityVerified(true);

          // Store secure session data for VIP users
          setTimeout(() => {
            try {
              EncryptedStorage.setSecureItem('vip_user', JSON.stringify(session.user));
              EncryptedStorage.setSecureItem('vip_session', JSON.stringify(session));
              console.log('🛡️ VIP session secured for:', session.user.email);
            } catch (error) {
              console.error('🛡️ Failed to store secure session:', error);
            }
          }, 0);
        } else {
          setUser(null);
          setSession(null);
          setIsSecurityVerified(false);
          EncryptedStorage.clearAllSecureItems();
        }
      } catch (error) {
        console.error('🛡️ Auth state change error:', error);
        setUser(null);
        setSession(null);
        setIsSecurityVerified(false);
      } finally {
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setLoading(false);
        }
      }
    });

    // Check for existing session with enhanced validation
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('🛡️ Error getting session:', error);
        setLoading(false);
        return;
      }
      
      console.log('🛡️ Initial session check:', session?.user?.email);
      // Let the auth state change handler process this
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('🛡️ Initiating secure Google sign-in...');
      
      // Check rate limiting before attempting sign-in
      const now = Date.now();
      const lastAttempt = localStorage.getItem('last_google_signin');
      if (lastAttempt && now - parseInt(lastAttempt) < 5000) { // 5 second rate limit
        return { error: { message: 'Please wait before trying again' } };
      }
      localStorage.setItem('last_google_signin', now.toString());

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
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
      // Input validation and sanitization
      const sanitizedEmail = SecurityHardening.validateAndSanitizeInput(email, 254);
      
      if (!sanitizedEmail || !password) {
        return { error: { message: 'Email and password are required' } };
      }

      // Check if account is locked out
      if (SecurityHardening.isUserLockedOut(sanitizedEmail)) {
        return { error: { message: 'Account temporarily locked. Please try again later.' } };
      }

      // Rate limiting for sign-in attempts
      const now = Date.now();
      const lastAttempt = localStorage.getItem(`signin_${sanitizedEmail}`);
      if (lastAttempt && now - parseInt(lastAttempt) < 3000) { // 3 second rate limit
        return { error: { message: 'Please wait before trying again' } };
      }
      localStorage.setItem(`signin_${sanitizedEmail}`, now.toString());

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });
      
      if (error) {
        console.error('🛡️ Sign-in error:', error);
        return { error };
      }
      
      console.log('🛡️ Successful sign-in for:', sanitizedEmail);
      return { data, error: null };
    } catch (error) {
      console.error('🛡️ Sign-in failed:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Input validation and sanitization
      const sanitizedEmail = SecurityHardening.validateAndSanitizeInput(email, 254);
      
      if (!sanitizedEmail || !password) {
        return { error: { message: 'Email and password are required' } };
      }

      // Enhanced VIP validation
      if (!isAllowedToSignUp(sanitizedEmail)) {
        console.warn('🛡️ Unauthorized signup attempt:', sanitizedEmail);
        return { error: { message: 'Registration is restricted to authorized users only' } };
      }

      // Password strength validation
      if (password.length < 8) {
        return { error: { message: 'Password must be at least 8 characters long' } };
      }

      // Rate limiting for sign-up attempts
      const now = Date.now();
      const lastAttempt = localStorage.getItem('last_signup_attempt');
      if (lastAttempt && now - parseInt(lastAttempt) < 60000) { // 1 minute rate limit
        return { error: { message: 'Please wait before creating another account' } };
      }
      localStorage.setItem('last_signup_attempt', now.toString());

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email_verified: false,
            signup_timestamp: new Date().toISOString()
          }
        }
      });
      
      if (error) {
        console.error('🛡️ Sign-up error:', error);
        return { error };
      }
      
      console.log('🛡️ VIP user signed up successfully:', sanitizedEmail);
      return { data, error: null };
    } catch (error) {
      console.error('🛡️ Sign-up failed:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🛡️ Secure sign-out initiated...');
      
      // Clear all sensitive data
      EncryptedStorage.clearAllSecureItems();
      localStorage.removeItem('vip_user');
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('🛡️ Sign-out error:', error);
      } else {
        console.log('🛡️ Secure sign-out completed');
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
    isSecurityVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
