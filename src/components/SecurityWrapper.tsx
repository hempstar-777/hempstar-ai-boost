
import React, { useEffect, useState } from 'react';
import SecurityHardening from '@/utils/securityHardening';
import { useAuth } from './AuthProvider';
import { LoginForm } from './LoginForm';
import { isVipUser } from '@/utils/vipAccess';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

export const SecurityWrapper = ({ children }: SecurityWrapperProps) => {
  const [securityVerified, setSecurityVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        console.log('🛡️ Security initialization started', { user: user?.email, authLoading });
        
        // Initialize security hardening
        SecurityHardening.initializeSecuritySuite();
        
        // Wait for auth to finish loading
        if (authLoading) {
          console.log('🛡️ Waiting for auth to finish loading...');
          return;
        }
        
        // Creator bypass - always allow
        const creatorEmails = ['chidoweywey@gmail.com', 'hempstar777@yahoo.ca'];
        const userEmail = user?.email?.toLowerCase().trim();
        
        if (user && creatorEmails.includes(userEmail || '')) {
          console.log('✅ Creator access granted:', userEmail);
          setSecurityVerified(true);
          setLoading(false);
          return;
        }
        
        // VIP users: allow access once authenticated
        if (user && isVipUser(user)) {
          console.log('🛡️ VIP access granted for:', user.email);
          setSecurityVerified(true);
        } else if (user) {
          // If someone else is logged in, deny access
          console.warn('🛡️ Unauthorized user detected:', user.email);
          setSecurityVerified(false);
        } else {
          // No user logged in
          console.log('🛡️ No user authenticated');
          setSecurityVerified(false);
        }
      } catch (error) {
        console.error('🛡️ Security initialization failed:', error);
        setSecurityVerified(false);
      } finally {
        setLoading(false);
      }
    };

    initializeSecurity();

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading && authLoading) {
        console.error('🛡️ Auth timeout');
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [user, authLoading, loading]);

  // Show loading while auth is still loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-blue-400 font-mono text-lg">
            🛡️ Initializing Security
          </div>
          <div className="text-blue-300 font-mono text-sm mt-2">
            Verifying access...
          </div>
        </div>
      </div>
    );
  }

  // Show login form if no user is authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Show unauthorized message if user is not a VIP
  if (!securityVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-red-400 font-mono max-w-md mx-auto p-8">
          <div className="text-4xl mb-4">🔐</div>
          <div className="text-xl mb-4">Access Denied</div>
          <div className="text-sm mb-6 text-gray-400">
            This application is restricted to authorized users only.
          </div>
          <div className="text-xs text-gray-500 mb-4">
            Signed in as: {user.email}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors mr-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized - show the app
  return <>{children}</>;
};
