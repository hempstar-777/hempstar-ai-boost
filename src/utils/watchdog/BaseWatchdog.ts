export abstract class BaseWatchdog {
  protected isRunning = false;
  protected intervalId: NodeJS.Timeout | null = null;
  protected department: string;
  protected checkInterval: number;

  constructor(department: string, checkInterval: number = 30000) {
    this.department = department;
    this.checkInterval = checkInterval;
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`🐕 Starting ${this.department} Watchdog`);
    
    // Initial check
    this.performCheck();
    
    // Set up periodic checks
    this.intervalId = setInterval(() => {
      this.performCheck();
    }, this.checkInterval);
  }

  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log(`🐕 Stopped ${this.department} Watchdog`);
  }

  protected abstract performCheck(): Promise<void>;

  protected async logIssue(issue: string, severity: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    console.warn(`🐕 ${this.department} Watchdog - ${severity.toUpperCase()}: ${issue}`);
    
    // Store in localStorage for tracking
    const key = `watchdog_${this.department.toLowerCase()}_issues`;
    const stored = localStorage.getItem(key);
    const issues = stored ? JSON.parse(stored) : [];
    
    issues.push({
      issue,
      severity,
      timestamp: new Date().toISOString(),
      department: this.department
    });
    
    // Keep only last 50 issues per department
    if (issues.length > 50) {
      issues.splice(0, issues.length - 50);
    }
    
    localStorage.setItem(key, JSON.stringify(issues));
  }

  protected async autoFix(description: string, fixFunction: () => Promise<void>): Promise<void> {
    try {
      console.log(`🔧 ${this.department} Watchdog auto-fixing: ${description}`);
      await fixFunction();
      console.log(`✅ ${this.department} Watchdog fixed: ${description}`);
    } catch (error) {
      console.error(`❌ ${this.department} Watchdog failed to fix: ${description}`, error);
      await this.logIssue(`Auto-fix failed: ${description}`, 'high');
    }
  }
}
