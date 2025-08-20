
import { useEffect, useState } from 'react';
import { watchdogManager } from '@/utils/watchdog/WatchdogManager';

export const useWatchdog = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [issues, setIssues] = useState<Array<{department: string, issues: any[]}>>([]);

  useEffect(() => {
    // Start watchdogs
    watchdogManager.startAll();
    setIsRunning(true);

    // Update issues periodically
    const updateIssues = () => {
      setIssues(watchdogManager.getAllIssues());
    };

    updateIssues();
    const interval = setInterval(updateIssues, 10000); // Update every 10 seconds

    return () => {
      clearInterval(interval);
      watchdogManager.stopAll();
      setIsRunning(false);
    };
  }, []);

  const getRecentIssues = (minutes: number = 5) => {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return issues.map(dept => ({
      ...dept,
      issues: dept.issues.filter(issue => 
        new Date(issue.timestamp).getTime() > cutoff
      )
    })).filter(dept => dept.issues.length > 0);
  };

  const getCriticalIssues = () => {
    return issues.map(dept => ({
      ...dept,
      issues: dept.issues.filter(issue => issue.severity === 'high')
    })).filter(dept => dept.issues.length > 0);
  };

  return {
    isRunning,
    issues,
    recentIssues: getRecentIssues(),
    criticalIssues: getCriticalIssues(),
    watchdogStatus: watchdogManager.getStatus()
  };
};
