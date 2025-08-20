
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BehaviorTracker } from './BehaviorTracker';
import { BehaviorInsights } from './BehaviorInsights';
import { AutomatedActions } from './AutomatedActions';
import { secureBackendService } from '@/services/secureBackendService';
import { Brain, Activity, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export const BehaviorDashboard = () => {
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isSecurityVerified } = useAuth();

  useEffect(() => {
    if (user && isSecurityVerified) {
      loadSecurityEvents();
    }
  }, [user, isSecurityVerified]);

  const loadSecurityEvents = async () => {
    try {
      setLoading(true);
      const events = await secureBackendService.getSecurityEvents(10);
      setSecurityEvents(events);
    } catch (error) {
      console.error('Error loading security events:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSecurityLogging = async () => {
    try {
      await secureBackendService.createAlert({
        alert_type: 'security_test',
        message: 'Security system test',
        severity: 'info',
        threshold_value: 0,
        current_value: 1
      });
      await loadSecurityEvents();
    } catch (error) {
      console.error('Error testing security logging:', error);
    }
  };

  if (!isSecurityVerified) {
    return (
      <Card className="bg-gradient-hemp border-0">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-hemp-dark mb-2">Security Verification Required</h3>
          <p className="text-hemp-dark/70">
            Please complete security verification to access behavioral tracking features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-hemp border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black text-hemp-dark flex items-center justify-center">
          <Brain className="w-8 h-8 mr-3" />
          CUSTOMER BEHAVIOR TRACKING SYSTEM
        </CardTitle>
        <CardDescription className="text-hemp-dark/80 font-semibold text-lg flex items-center justify-center">
          <Shield className="w-5 h-5 mr-2" />
          AI-powered visitor behavior analysis with automated marketing responses
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Security Status */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-hemp-dark flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Monitoring
            </h3>
            <Button onClick={testSecurityLogging} size="sm" variant="outline">
              Test Security Logging
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-500/10 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-green-700">✓ ACTIVE</div>
              <div className="text-xs text-green-600">Security Hardening</div>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-700">✓ VERIFIED</div>
              <div className="text-xs text-blue-600">User Access</div>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-purple-700">{securityEvents.length}</div>
              <div className="text-xs text-purple-600">Security Events</div>
            </div>
            <div className="bg-orange-500/10 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-orange-700">✓ ENCRYPTED</div>
              <div className="text-xs text-orange-600">Data Storage</div>
            </div>
          </div>

          {securityEvents.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-hemp-dark">Recent Security Events</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {securityEvents.slice(0, 3).map((event, index) => (
                  <div key={index} className="text-xs bg-muted/50 p-2 rounded flex justify-between">
                    <span className="font-medium">{event.event_type}</span>
                    <span className="text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Behavior Tracking */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-hemp-dark flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Real-Time Behavior Monitoring
          </h3>
          <BehaviorTracker />
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-hemp-dark">AI Behavioral Insights</h3>
          <BehaviorInsights />
        </div>

        {/* Automated Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-hemp-dark">Smart Marketing Automation</h3>
          <AutomatedActions />
        </div>
      </CardContent>
    </Card>
  );
};
