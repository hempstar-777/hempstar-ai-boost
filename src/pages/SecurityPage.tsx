import React from 'react';
import { SecurityStatusIndicator } from '@/components/security/SecurityStatusIndicator';
import { AISystemStatus } from '@/components/AISystemStatus';
import { WatchdogStatus } from '@/components/watchdog/WatchdogStatus';

export default function SecurityPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Security Dashboard</h1>
      <p className="text-muted-foreground">
        Monitor and manage the security status of your application.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityStatusIndicator />
        <WatchdogStatus />
      </div>

      <AISystemStatus />
    </div>
  );
}
