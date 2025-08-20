
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWatchdog } from '@/hooks/useWatchdog';
import { Shield, Server, Bot, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const departmentIcons = {
  Security: Shield,
  Backend: Server,
  'AI Agents': Bot,
  Performance: Zap
};

export const WatchdogStatus = () => {
  const { isRunning, watchdogStatus, recentIssues, criticalIssues } = useWatchdog();

  const totalCritical = criticalIssues.reduce((sum, dept) => sum + dept.issues.length, 0);
  const totalRecent = recentIssues.reduce((sum, dept) => sum + dept.issues.length, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Multi-Department Watchdogs
            </CardTitle>
            <Badge variant={isRunning ? "default" : "destructive"}>
              {isRunning ? "Active" : "Stopped"}
            </Badge>
          </div>
          <CardDescription>
            Automated monitoring and auto-healing across all departments
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Department Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(watchdogStatus).map(([dept, running]) => {
              const IconComponent = departmentIcons[dept as keyof typeof departmentIcons] || Shield;
              return (
                <div key={dept} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{dept}</span>
                  {running ? (
                    <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-red-500 ml-auto" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Issue Summary */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">Critical Issues: {totalCritical}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm">Recent Issues: {totalRecent}</span>
            </div>
          </div>

          {/* Recent Issues */}
          {recentIssues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Issues (Last 5 minutes):</h4>
              {recentIssues.map((dept, idx) => (
                <div key={idx} className="space-y-1">
                  <h5 className="text-xs font-medium text-muted-foreground">{dept.department}:</h5>
                  {dept.issues.slice(-3).map((issue, issueIdx) => (
                    <div key={issueIdx} className="text-xs p-2 rounded bg-muted/30 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        issue.severity === 'high' ? 'bg-red-500' :
                        issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      {issue.issue}
                      <span className="text-muted-foreground ml-auto">
                        {new Date(issue.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {recentIssues.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              🎉 All systems running smoothly - no issues detected!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
