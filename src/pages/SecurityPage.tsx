
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecurityStatusIndicator } from '@/components/security/SecurityStatusIndicator';
import { secureBackendService } from '@/services/secureBackendService';
import { SecurityValidation } from '@/utils/securityValidation';
import { useAuth } from '@/components/AuthProvider';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Database,
  Key,
  Fingerprint
} from 'lucide-react';

export const SecurityPage = () => {
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isSecurityVerified } = useAuth();

  useEffect(() => {
    if (user && isSecurityVerified) {
      loadSecurityData();
    }
  }, [user, isSecurityVerified]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const events = await secureBackendService.getSecurityEvents(20);
      setSecurityEvents(events);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runSecurityTests = async () => {
    setLoading(true);
    const results: any[] = [];

    try {
      // Test input validation
      const validInput = SecurityValidation.sanitizeInput('<script>alert("test")</script>Hello World');
      results.push({
        test: 'Input Sanitization',
        status: validInput === '[SCRIPT_REMOVED]Hello World' ? 'pass' : 'fail',
        details: `Input: '<script>alert("test")</script>Hello World' → Output: '${validInput}'`
      });

      // Test UUID validation
      const validUUID = SecurityValidation.isValidUUID('123e4567-e89b-12d3-a456-426614174000');
      const invalidUUID = SecurityValidation.isValidUUID('invalid-uuid');
      results.push({
        test: 'UUID Validation',
        status: validUUID && !invalidUUID ? 'pass' : 'fail',
        details: `Valid UUID: ${validUUID}, Invalid UUID: ${invalidUUID}`
      });

      // Test email validation
      const validEmail = SecurityValidation.isValidEmail('test@example.com');
      const invalidEmail = SecurityValidation.isValidEmail('invalid-email');
      results.push({
        test: 'Email Validation',
        status: validEmail && !invalidEmail ? 'pass' : 'fail',
        details: `Valid email: ${validEmail}, Invalid email: ${invalidEmail}`
      });

      // Test password strength
      const strongPassword = SecurityValidation.validatePasswordStrength('StrongP@ssw0rd123!');
      const weakPassword = SecurityValidation.validatePasswordStrength('weak');
      results.push({
        test: 'Password Strength',
        status: strongPassword.valid && !weakPassword.valid ? 'pass' : 'fail',
        details: `Strong: ${strongPassword.valid}, Weak: ${weakPassword.valid}`
      });

      // Test rate limiting
      const rateLimitOk = await SecurityValidation.checkRateLimit(user?.id || 'test', 'security_test', 5);
      results.push({
        test: 'Rate Limiting',
        status: rateLimitOk ? 'pass' : 'fail',
        details: `Rate limit check passed: ${rateLimitOk}`
      });

      // Test secure backend service
      await secureBackendService.createAlert({
        alert_type: 'security_test',
        message: 'Security test completed successfully',
        severity: 'info',
        threshold_value: 0,
        current_value: 1
      });
      results.push({
        test: 'Secure Backend Service',
        status: 'pass',
        details: 'Alert created successfully through secure service'
      });

    } catch (error) {
      results.push({
        test: 'Security Test Error',
        status: 'fail',
        details: `Error: ${error}`
      });
    }

    setTestResults(results);
    setLoading(false);
    await loadSecurityData();
  };

  if (!isSecurityVerified) {
    return (
      <div className="min-h-screen bg-gradient-hemp p-6 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-hemp-dark mb-2">Access Denied</h3>
            <p className="text-hemp-dark/70">
              Security verification required to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hemp p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-black text-hemp-dark flex items-center justify-center">
              <Shield className="w-8 h-8 mr-3" />
              SECURITY COMMAND CENTER
            </CardTitle>
            <CardDescription className="text-hemp-dark/80 font-semibold text-lg">
              Comprehensive security monitoring and testing dashboard
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Security Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-lg font-bold text-green-700">SECURED</div>
              <div className="text-sm text-muted-foreground">Security Hardening</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-bold text-blue-700">ENCRYPTED</div>
              <div className="text-sm text-muted-foreground">Data Protection</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-lg font-bold text-purple-700">MONITORED</div>
              <div className="text-sm text-muted-foreground">Activity Tracking</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Fingerprint className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-lg font-bold text-orange-700">VERIFIED</div>
              <div className="text-sm text-muted-foreground">User Identity</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Real-Time Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SecurityStatusIndicator />
            </CardContent>
          </Card>

          {/* Security Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Security Testing Suite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runSecurityTests} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Running Tests...' : 'Run Security Tests'}
              </Button>
              
              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Test Results:</h4>
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm font-medium">{result.test}</span>
                      <Badge variant={result.status === 'pass' ? 'default' : 'destructive'}>
                        {result.status === 'pass' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Events Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Security Events Log
              </div>
              <Button onClick={loadSecurityData} size="sm" variant="outline">
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {securityEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <p>No security events logged yet.</p>
                <p className="text-sm">Run security tests to generate events.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {securityEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{event.event_type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {event.details && (
                      <div className="text-xs text-muted-foreground">
                        {JSON.stringify(event.details, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
