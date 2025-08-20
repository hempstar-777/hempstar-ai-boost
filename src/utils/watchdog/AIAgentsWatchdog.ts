
import { BaseWatchdog } from './BaseWatchdog';
import { supabase } from '@/integrations/supabase/client';

export class AIAgentsWatchdog extends BaseWatchdog {
  private stuckAgents: Set<string> = new Set();

  constructor() {
    super('AI Agents', 45000); // Check every 45 seconds
  }

  protected async performCheck(): Promise<void> {
    await this.checkAgentHealth();
    await this.monitorExecutionTimes();
    await this.checkStuckAgents();
    await this.validateAgentConfigs();
  }

  private async checkAgentHealth(): Promise<void> {
    try {
      const { data: agents, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('status', 'active');

      if (error) {
        await this.logIssue(`Failed to fetch agents: ${error.message}`, 'medium');
        return;
      }

      for (const agent of agents || []) {
        // Check if agent has been running too long
        if (agent.last_run_at) {
          const lastRun = new Date(agent.last_run_at).getTime();
          const timeSinceRun = Date.now() - lastRun;
          
          // If agent hasn't run in over an hour but should have
          if (timeSinceRun > 60 * 60 * 1000 && agent.schedule_cron) {
            await this.logIssue(`Agent ${agent.name} hasn't run in over an hour`, 'medium');
          }
        }

        // Check agent configuration
        if (!agent.config || Object.keys(agent.config).length === 0) {
          await this.logIssue(`Agent ${agent.name} has empty configuration`, 'low');
        }
      }
    } catch (error) {
      await this.logIssue(`Agent health check failed: ${error}`, 'medium');
    }
  }

  private async monitorExecutionTimes(): Promise<void> {
    try {
      const { data: logs, error } = await supabase
        .from('agent_logs')
        .select('*')
        .eq('status', 'started')
        .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()); // Last 10 minutes

      if (error) return;

      for (const log of logs || []) {
        const startTime = new Date(log.created_at).getTime();
        const runningTime = Date.now() - startTime;

        // If execution is running for more than 5 minutes
        if (runningTime > 5 * 60 * 1000) {
          this.stuckAgents.add(log.agent_id);
          await this.logIssue(`Agent ${log.agent_id} execution stuck for ${Math.round(runningTime/60000)} minutes`, 'high');
        }
      }
    } catch (error) {
      await this.logIssue(`Execution monitoring failed: ${error}`, 'low');
    }
  }

  private async checkStuckAgents(): Promise<void> {
    if (this.stuckAgents.size > 0) {
      await this.autoFix(`Reset ${this.stuckAgents.size} stuck agents`, async () => {
        for (const agentId of this.stuckAgents) {
          try {
            // Update agent status to reset it
            await supabase
              .from('ai_agents')
              .update({ status: 'active', last_run_at: new Date().toISOString() })
              .eq('id', agentId);

            // Log the reset
            await supabase.from('agent_logs').insert({
              agent_id: agentId,
              status: 'reset',
              message: 'Agent reset by watchdog due to stuck execution'
            });
          } catch (error) {
            console.error(`Failed to reset agent ${agentId}:`, error);
          }
        }
        this.stuckAgents.clear();
      });
    }
  }

  private async validateAgentConfigs(): Promise<void> {
    try {
      const { data: agents, error } = await supabase
        .from('ai_agents')
        .select('id, name, type, config')
        .eq('status', 'active');

      if (error) return;

      for (const agent of agents || []) {
        const issues: string[] = [];

        // Check based on agent type
        switch (agent.type) {
          case 'social_media_poster':
            if (!agent.config?.prompt) {
              issues.push('Missing prompt configuration');
            }
            break;
          case 'trend_analyzer':
            if (!agent.config?.keywords && !agent.config?.prompt) {
              issues.push('Missing keywords or prompt configuration');
            }
            break;
        }

        if (issues.length > 0) {
          await this.logIssue(`Agent ${agent.name} config issues: ${issues.join(', ')}`, 'low');
        }
      }
    } catch (error) {
      await this.logIssue(`Config validation failed: ${error}`, 'low');
    }
  }
}
