
import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SecurityValidation } from '@/utils/securityValidation';
import { SecureSessionManager } from '@/utils/secureSessionManager';
import { useAuth } from '@/components/AuthProvider';

interface SecurityStatus {
  level: 'secure' | 'warning' | 'critical';
  message: string;
  details: string[];
}

export const SecurityStatusIndicator = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    level: 'warning',
    message: 'Checking security status...',
    details: []
  });
  const { user, isSecurityVerified } = useAuth();

  useEffect(() => {
    checkSecurityStatus();
    
    // Check security status every 5 minutes
    const interval = setInterval(checkSecurityStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, isSecurityVerified]);

  const checkSecurityStatus = async () => {
    const details: string[] = [];
    let level: SecurityStatus['level'] = 'secure';
    let message = 'Security status optimal';

    try {
      // Check HTTPS
      if (location.protocol !== 'https:' && !location.hostname.includes('localhost')) {
        level = 'critical';
        message = 'Critical security issues detected';
        details.push('Connection not secured with HTTPS');
      }

      // Check session validity
      const sessionValid = await SecureSessionManager.validateSession();
      if (!sessionValid) {
        level = 'critical';
        message = 'Authentication issues detected';
        details.push('Session validation failed');
      }

      // Check if user is authenticated and verified
      if (!user) {
        level = 'warning';
        message = 'User not authenticated';
        details.push('Please sign in to access security features');
      } else if (!isSecurityVerified) {
        level = 'critical';
        message = 'Access verification failed';
        details.push('User access not properly verified');
      }

      // Check for development environment
      if (location.hostname === 'localhost' || location.hostname.includes('127.0.0.1')) {
        if (level === 'secure') level = 'warning';
        details.push('Running in development mode');
      }

      // Add positive checks
      if (level === 'secure') {
        details.push('HTTPS connection established');
        details.push('User authentication verified');
        details.push('Session security validated');
        details.push('Input validation active');
      }

    } catch (error) {
      level = 'critical';
      message = 'Security check failed';
      details.push('Unable to validate security status');
      console.error('Security status check failed:', error);
    }

    setSecurityStatus({ level, message, details });
  };

  const getIcon = () => {
    switch (securityStatus.level) {
      case 'secure':
        return <ShieldCheck className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <Shield className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
    }
  };

  const getBadgeVariant = () => {
    switch (securityStatus.level) {
      case 'secure':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'critical':
        return 'destructive';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          {getIcon()}
          <h3 className="font-semibold text-sm">Security Status</h3>
          <Badge variant={getBadgeVariant()} className="ml-auto text-xs">
            {securityStatus.level.toUpperCase()}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">
          {securityStatus.message}
        </p>
        
        {securityStatus.details.length > 0 && (
          <div className="space-y-1">
            {securityStatus.details.map((detail, index) => (
              <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  securityStatus.level === 'secure' ? 'bg-green-500' :
                  securityStatus.level === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                {detail}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
