
import React, { useEffect, useState } from 'react';
import SecurityHardening from '@/utils/securityHardening';
import { useAuth } from './AuthProvider';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

export const SecurityWrapper = ({ children }: SecurityWrapperProps) => {
  const [securityVerified, setSecurityVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        // Initialize security hardening
        SecurityHardening.initializeSecuritySuite();
        
        // For VIP creator, always allow access once authenticated
        if (user && (
          user.email === 'creator@hempstar.ai' ||
          user.user_metadata?.email === 'creator@hempstar.ai' ||
          user.identities?.some(identity => 
            identity.identity_data?.email === 'creator@hempstar.ai'
          )
        )) {
          console.log('🛡️ VIP Creator access granted');
          setSecurityVerified(true);
        } else if (user) {
          // If someone else is logged in, verify authorization
          const isAuthorized = await SecurityHardening.verifyAuthorizedUser();
          setSecurityVerified(isAuthorized);
        } else {
          // No user logged in
          setSecurityVerified(false);
        }
      } catch (error) {
        console.error('🛡️ Security initialization failed:', error);
        // Don't block on security initialization errors
        setSecurityVerified(user !== null);
      } finally {
        setLoading(false);
      }
    };

    initializeSecurity();
  }, [user]);

  if (loading) {
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

  if (!securityVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-red-400 font-mono max-w-md mx-auto p-8">
          <div className="text-4xl mb-4">🔐</div>
          <div className="text-xl mb-4">Authentication Required</div>
          <div className="text-sm mb-6 text-gray-400">
            Please sign in with your authorized Google account to access this application.
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry Authentication
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
