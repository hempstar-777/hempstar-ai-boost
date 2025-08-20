
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import EnhancedSecurityHardening from '@/utils/enhancedSecurityHardening';
import { SecurityValidation } from '@/utils/securityValidation';
import { SecureSessionManager } from '@/utils/secureSessionManager';
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
    
    // Initialize enhanced security
    EnhancedSecurityHardening.initializeEnhancedSecurity();
    
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🛡️ Auth state changed:', event, session?.user?.email);
      
      try {
        if (session?.user) {
          // Enhanced security validation
          const accessVerified = await EnhancedSecurityHardening.verifyEnhancedUserAccess();
          
          if (!accessVerified) {
            console.error('🛡️ Enhanced user verification failed, signing out');
            setIsSecurityVerified(false);
            await SecureSessionManager.secureSignOut();
            return;
          }

          setUser(session.user);
          setSession(session);
          setIsSecurityVerified(true);

          console.log('🛡️ Enhanced VIP session secured for:', session.user.email);
        } else {
          setUser(null);
          setSession(null);
          setIsSecurityVerified(false);
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

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('🛡️ Error getting session:', error);
        setLoading(false);
        return;
      }
      
      console.log('🛡️ Initial session check:', session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('🛡️ Initiating secure Google sign-in...');
      
      // Rate limiting
      const now = Date.now();
      const lastAttempt = localStorage.getItem('last_google_signin');
      if (lastAttempt && now - parseInt(lastAttempt) < 5000) {
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
        await SecurityValidation.logSecurityEvent(
          null,
          'google_signin_failed',
          { error: error.message }
        );
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
      // Enhanced input validation
      const sanitizedEmail = SecurityValidation.sanitizeInput(email);
      
      if (!SecurityValidation.isValidEmail(sanitizedEmail)) {
        return { error: { message: 'Invalid email format' } };
      }

      if (!password || password.length < 8) {
        return { error: { message: 'Password must be at least 8 characters' } };
      }

      // Rate limiting
      const rateLimitOk = await SecurityValidation.checkRateLimit(
        'signin_' + sanitizedEmail, 
        'signin', 
        5 // Max 5 attempts per hour per email
      );

      if (!rateLimitOk) {
        await SecurityValidation.logSecurityEvent(
          null,
          'signin_rate_limit_exceeded',
          { email: sanitizedEmail }
        );
        return { error: { message: 'Too many sign-in attempts. Please try again later.' } };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });
      
      if (error) {
        console.error('🛡️ Sign-in error:', error);
        await SecurityValidation.logSecurityEvent(
          null,
          'signin_failed',
          { email: sanitizedEmail, error: error.message }
        );
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
      // Enhanced input validation
      const sanitizedEmail = SecurityValidation.sanitizeInput(email);
      
      if (!SecurityValidation.isValidEmail(sanitizedEmail)) {
        return { error: { message: 'Invalid email format' } };
      }

      // Enhanced VIP validation
      if (!isAllowedToSignUp(sanitizedEmail)) {
        console.warn('🛡️ Unauthorized signup attempt:', sanitizedEmail);
        await SecurityValidation.logSecurityEvent(
          null,
          'unauthorized_signup_attempt',
          { email: sanitizedEmail }
        );
        return { error: { message: 'Registration is restricted to authorized users only' } };
      }

      // Enhanced password validation
      const passwordValidation = SecurityValidation.validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        return { error: { message: passwordValidation.errors.join(', ') } };
      }

      // Rate limiting
      const rateLimitOk = await SecurityValidation.checkRateLimit(
        'signup_global',
        'signup',
        3 // Max 3 signups per hour globally
      );

      if (!rateLimitOk) {
        return { error: { message: 'Registration temporarily limited. Please try again later.' } };
      }

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
        await SecurityValidation.logSecurityEvent(
          null,
          'signup_failed',
          { email: sanitizedEmail, error: error.message }
        );
        return { error };
      }
      
      console.log('🛡️ VIP user signed up successfully:', sanitizedEmail);
      await SecurityValidation.logSecurityEvent(
        data.user?.id || null,
        'vip_signup_success',
        { email: sanitizedEmail }
      );
      return { data, error: null };
    } catch (error) {
      console.error('🛡️ Sign-up failed:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🛡️ Secure sign-out initiated...');
      await SecureSessionManager.secureSignOut();
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
