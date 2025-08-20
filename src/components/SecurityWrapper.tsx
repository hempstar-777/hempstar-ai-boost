
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
        
        // Verify user authorization
        const isAuthorized = await SecurityHardening.verifyAuthorizedUser();
        
        if (isAuthorized && user?.email === 'creator@hempstar.ai') {
          setSecurityVerified(true);
        } else {
          setSecurityVerified(false);
        }
      } catch (error) {
        console.error('Security initialization failed:', error);
        setSecurityVerified(false);
      } finally {
        setLoading(false);
      }
    };

    initializeSecurity();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-red-500 font-mono text-lg">
            🛡️ INITIALIZING SECURITY PROTOCOLS
          </div>
          <div className="text-red-400 font-mono text-sm mt-2">
            VERIFYING AUTHORIZATION...
          </div>
        </div>
      </div>
    );
  }

  if (!securityVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-red-500 font-mono">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-2xl mb-2">ACCESS DENIED</div>
          <div className="text-lg">UNAUTHORIZED ACCESS ATTEMPT</div>
          <div className="text-sm mt-4 text-red-400">
            This incident has been logged
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
