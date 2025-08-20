
import { BaseWatchdog } from './BaseWatchdog';

export class PerformanceWatchdog extends BaseWatchdog {
  private performanceMetrics: Array<{ timestamp: number; metric: string; value: number }> = [];

  constructor() {
    super('Performance', 30000); // Check every 30 seconds
  }

  protected async performCheck(): Promise<void> {
    await this.checkMemoryUsage();
    await this.checkLoadTimes();
    await this.monitorLocalStorage();
    await this.checkNetworkHealth();
  }

  private async checkMemoryUsage(): Promise<void> {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      
      this.performanceMetrics.push({
        timestamp: Date.now(),
        metric: 'memory_usage_mb',
        value: usedMB
      });

      const usagePercent = (usedMB / limitMB) * 100;
      
      if (usagePercent > 80) {
        await this.logIssue(`High memory usage: ${usedMB}MB (${usagePercent.toFixed(1)}%)`, 'high');
        
        await this.autoFix('Clean up memory', async () => {
          // Force garbage collection if available
          if (window.gc) {
            window.gc();
          }
          
          // Clean old performance metrics
          this.performanceMetrics = this.performanceMetrics.slice(-50);
          
          // Clean old localStorage entries
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.includes('old_') || key.includes('temp_')) {
              localStorage.removeItem(key);
            }
          });
        });
      }
    }
  }

  private async checkLoadTimes(): Promise<void> {
    if ('navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      this.performanceMetrics.push({
        timestamp: Date.now(),
        metric: 'page_load_time',
        value: loadTime
      });

      if (loadTime > 5000) { // Slow load time
        await this.logIssue(`Slow page load time: ${Math.round(loadTime)}ms`, 'medium');
      }
    }
  }

  private async monitorLocalStorage(): Promise<void> {
    try {
      let totalSize = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }

      const sizeMB = totalSize / (1024 * 1024);
      
      if (sizeMB > 8) { // LocalStorage approaching limit
        await this.logIssue(`LocalStorage usage high: ${sizeMB.toFixed(2)}MB`, 'medium');
        
        await this.autoFix('Clean LocalStorage', async () => {
          // Remove oldest entries from various watchdog logs
          const watchdogKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('watchdog_') || key.includes('_events') || key.includes('_logs')
          );
          
          for (const key of watchdogKeys) {
            try {
              const data = JSON.parse(localStorage.getItem(key) || '[]');
              if (Array.isArray(data) && data.length > 20) {
                const reduced = data.slice(-20); // Keep only last 20 entries
                localStorage.setItem(key, JSON.stringify(reduced));
              }
            } catch (e) {
              localStorage.removeItem(key);
            }
          }
        });
      }
    } catch (error) {
      await this.logIssue(`LocalStorage monitoring failed: ${error}`, 'low');
    }
  }

  private async checkNetworkHealth(): Promise<void> {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        await this.logIssue(`Slow network detected: ${connection.effectiveType}`, 'medium');
      }

      if (connection.saveData) {
        await this.logIssue('Data saver mode detected', 'low');
      }
    }

    // Check for failed network requests
    const failedRequests = this.performanceMetrics.filter(m => 
      m.metric === 'failed_request' && Date.now() - m.timestamp < 5 * 60 * 1000
    ).length;

    if (failedRequests > 5) {
      await this.logIssue(`Multiple network failures: ${failedRequests} in last 5 minutes`, 'high');
    }
  }

  recordFailedRequest(): void {
    this.performanceMetrics.push({
      timestamp: Date.now(),
      metric: 'failed_request',
      value: 1
    });
  }
}
