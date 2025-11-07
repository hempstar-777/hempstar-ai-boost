
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
  signInWithPhone: (phone: string) => Promise<any>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<any>;
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
          const userEmail = session.user.email?.toLowerCase().trim();
          
          // Creator bypass - no security checks needed
          if (userEmail === 'chidoweywey@gmail.com' || userEmail === 'hempstar777@yahoo.ca') {
            console.log('✅ Creator authenticated - full access granted');
            setUser(session.user);
            setSession(session);
            setIsSecurityVerified(true);
          } else {
            // Enhanced security validation for other users
            const accessVerified = await EnhancedSecurityHardening.verifyEnhancedUserAccess();
            
            if (!accessVerified) {
              console.error('🛡️ User verification failed');
              setIsSecurityVerified(false);
              await SecureSessionManager.secureSignOut();
              return;
            }

            setUser(session.user);
            setSession(session);
            setIsSecurityVerified(true);
          }

          console.log('🛡️ Session secured for:', session.user.email);
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

  // Phone number sign-in (OTP via SMS)
  const signInWithPhone = async (phone: string) => {
    try {
      const sanitizedPhone = SecurityValidation.sanitizeInput(phone);
      if (!sanitizedPhone || sanitizedPhone.length < 8) {
        return { error: { message: 'Enter a valid phone number' } };
      }

      const { data, error } = await supabase.auth.signInWithOtp({
        phone: sanitizedPhone,
        options: { channel: 'sms' }
      });

      if (error) {
        await SecurityValidation.logSecurityEvent(
          null,
          'phone_signin_failed',
          { phone: sanitizedPhone, error: error.message }
        );
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('🛡️ Phone sign-in failed:', error);
      return { error };
    }
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      const sanitizedPhone = SecurityValidation.sanitizeInput(phone);
      const sanitizedToken = SecurityValidation.sanitizeInput(token);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: sanitizedPhone,
        token: sanitizedToken,
        type: 'sms'
      });

      if (error) {
        await SecurityValidation.logSecurityEvent(
          null,
          'phone_verify_failed',
          { phone: sanitizedPhone, error: error.message }
        );
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('🛡️ OTP verification failed:', error);
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
      const sanitizedEmail = SecurityValidation.sanitizeInput(email);
      
      if (!SecurityValidation.isValidEmail(sanitizedEmail)) {
        return { error: { message: 'Invalid email format' } };
      }

      // Creator bypass - always allow creator to sign up
      const creatorEmails = ['chidoweywey@gmail.com', 'hempstar777@yahoo.ca'];
      const isCreator = creatorEmails.includes(sanitizedEmail.toLowerCase());

      if (!isCreator && !isAllowedToSignUp(sanitizedEmail)) {
        return { error: { message: 'Registration is restricted to authorized users only' } };
      }

      if (password.length < 6) {
        return { error: { message: 'Password must be at least 6 characters' } };
      }

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            is_creator: isCreator,
            signup_timestamp: new Date().toISOString()
          }
        }
      });
      
      if (error) {
        console.error('🛡️ Sign-up error:', error);
        return { error };
      }
      
      console.log(isCreator ? '✅ Creator signed up successfully' : '🛡️ User signed up successfully');
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
    signInWithPhone,
    verifyPhoneOtp,
    signUp,
    signOut,
    isSecurityVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
