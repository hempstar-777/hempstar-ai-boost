
import { SecurityWatchdog } from './SecurityWatchdog';
import { BackendWatchdog } from './BackendWatchdog';
import { AIAgentsWatchdog } from './AIAgentsWatchdog';
import { PerformanceWatchdog } from './PerformanceWatchdog';
import { BaseWatchdog } from './BaseWatchdog';

export class WatchdogManager {
  private watchdogs: Map<string, BaseWatchdog> = new Map();
  private isRunning = false;

  constructor() {
    this.initializeWatchdogs();
  }

  private initializeWatchdogs(): void {
    this.watchdogs.set('security', new SecurityWatchdog());
    this.watchdogs.set('backend', new BackendWatchdog());
    this.watchdogs.set('ai-agents', new AIAgentsWatchdog());
    this.watchdogs.set('performance', new PerformanceWatchdog());
  }

  startAll(): void {
    if (this.isRunning) return;

    console.log('🐕‍🦺 Starting all Watchdogs...');
    this.isRunning = true;

    for (const [name, watchdog] of this.watchdogs) {
      try {
        watchdog.start();
      } catch (error) {
        console.error(`Failed to start ${name} watchdog:`, error);
      }
    }

    // Set up cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.stopAll();
    });

    console.log('🐕‍🦺 All Watchdogs started successfully');
  }

  stopAll(): void {
    if (!this.isRunning) return;

    console.log('🐕‍🦺 Stopping all Watchdogs...');
    this.isRunning = false;

    for (const [name, watchdog] of this.watchdogs) {
      try {
        watchdog.stop();
      } catch (error) {
        console.error(`Failed to stop ${name} watchdog:`, error);
      }
    }
  }

  getWatchdog(name: string): BaseWatchdog | undefined {
    return this.watchdogs.get(name);
  }

  getStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const [name, watchdog] of this.watchdogs) {
      status[name] = (watchdog as any).isRunning;
    }
    return status;
  }

  getAllIssues(): Array<{department: string, issues: any[]}> {
    const allIssues: Array<{department: string, issues: any[]}> = [];
    
    for (const [name, watchdog] of this.watchdogs) {
      const department = (watchdog as any).department;
      const key = `watchdog_${department.toLowerCase()}_issues`;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        try {
          const issues = JSON.parse(stored);
          allIssues.push({ department, issues });
        } catch (e) {
          // Clean up corrupted data
          localStorage.removeItem(key);
        }
      }
    }
    
    return allIssues;
  }

  recordNetworkFailure(): void {
    const perfWatchdog = this.watchdogs.get('performance') as PerformanceWatchdog;
    if (perfWatchdog) {
      perfWatchdog.recordFailedRequest();
    }
  }
}

// Create singleton instance
export const watchdogManager = new WatchdogManager();
