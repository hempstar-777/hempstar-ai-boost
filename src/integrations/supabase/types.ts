export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      advanced_agent_configs: {
        Row: {
          agent_id: string
          created_at: string
          execution_config: Json
          id: string
          integration_config: Json
          performance_config: Json
          security_config: Json
          trigger_config: Json
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          execution_config?: Json
          id?: string
          integration_config?: Json
          performance_config?: Json
          security_config?: Json
          trigger_config?: Json
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          execution_config?: Json
          id?: string
          integration_config?: Json
          performance_config?: Json
          security_config?: Json
          trigger_config?: Json
          updated_at?: string
        }
        Relationships: []
      }
      advanced_schedules: {
        Row: {
          agent_id: string
          config: Json
          created_at: string
          enabled: boolean
          id: string
          last_run: string | null
          next_run: string | null
          priority: string
          timezone: string
          type: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          last_run?: string | null
          next_run?: string | null
          priority?: string
          timezone?: string
          type: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          last_run?: string | null
          next_run?: string | null
          priority?: string
          timezone?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advanced_schedules_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_stats: {
        Row: {
          affiliate_id: string
          clicks: number
          conversion_rate: number
          created_at: string
          id: string
          pending_earnings: number
          referrals_count: number
          total_earnings: number
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          clicks?: number
          conversion_rate?: number
          created_at?: string
          id?: string
          pending_earnings?: number
          referrals_count?: number
          total_earnings?: number
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          clicks?: number
          conversion_rate?: number
          created_at?: string
          id?: string
          pending_earnings?: number
          referrals_count?: number
          total_earnings?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_stats_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          code: string
          commission_rate: number
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          commission_rate?: number
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          commission_rate?: number
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_execution_locks: {
        Row: {
          agent_id: string
          expires_at: string
        }
        Insert: {
          agent_id: string
          expires_at: string
        }
        Update: {
          agent_id?: string
          expires_at?: string
        }
        Relationships: []
      }
      agent_logs: {
        Row: {
          agent_id: string
          created_at: string
          data: Json | null
          duration_ms: number | null
          execution_id: string
          id: string
          message: string | null
          status: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          data?: Json | null
          duration_ms?: number | null
          execution_id?: string
          id?: string
          message?: string | null
          status: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          data?: Json | null
          duration_ms?: number | null
          execution_id?: string
          id?: string
          message?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          enable_multitasking: boolean | null
          id: string
          last_run_at: string | null
          max_parallel_tasks: number | null
          max_thinking_depth: number | null
          name: string
          next_run_at: string | null
          schedule_cron: string
          schedule_enabled: boolean | null
          schedule_interval_minutes: number | null
          schedule_timezone: string | null
          schedule_type: string | null
          security_level: string | null
          status: Database["public"]["Enums"]["agent_status"]
          thinking_model: string | null
          type: Database["public"]["Enums"]["agent_type"]
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          enable_multitasking?: boolean | null
          id?: string
          last_run_at?: string | null
          max_parallel_tasks?: number | null
          max_thinking_depth?: number | null
          name: string
          next_run_at?: string | null
          schedule_cron: string
          schedule_enabled?: boolean | null
          schedule_interval_minutes?: number | null
          schedule_timezone?: string | null
          schedule_type?: string | null
          security_level?: string | null
          status?: Database["public"]["Enums"]["agent_status"]
          thinking_model?: string | null
          type: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          enable_multitasking?: boolean | null
          id?: string
          last_run_at?: string | null
          max_parallel_tasks?: number | null
          max_thinking_depth?: number | null
          name?: string
          next_run_at?: string | null
          schedule_cron?: string
          schedule_enabled?: boolean | null
          schedule_interval_minutes?: number | null
          schedule_timezone?: string | null
          schedule_type?: string | null
          security_level?: string | null
          status?: Database["public"]["Enums"]["agent_status"]
          thinking_model?: string | null
          type?: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          agent_id: string | null
          created_at: string
          details: Json
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          agent_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          agent_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      behavior_actions: {
        Row: {
          action_config: Json
          action_type: string
          created_at: string
          enabled: boolean | null
          executions_count: number | null
          id: string
          success_rate: number | null
          trigger_pattern: string
          updated_at: string
        }
        Insert: {
          action_config?: Json
          action_type: string
          created_at?: string
          enabled?: boolean | null
          executions_count?: number | null
          id?: string
          success_rate?: number | null
          trigger_pattern: string
          updated_at?: string
        }
        Update: {
          action_config?: Json
          action_type?: string
          created_at?: string
          enabled?: boolean | null
          executions_count?: number | null
          id?: string
          success_rate?: number | null
          trigger_pattern?: string
          updated_at?: string
        }
        Relationships: []
      }
      behavior_insights: {
        Row: {
          active: boolean | null
          confidence_score: number | null
          created_at: string
          id: string
          pattern_data: Json
          pattern_type: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          pattern_data?: Json
          pattern_type: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          pattern_data?: Json
          pattern_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_channels: {
        Row: {
          agent_id: string
          bookings_count: number
          config: Json
          created_at: string
          id: string
          last_used: string | null
          name: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          bookings_count?: number
          config?: Json
          created_at?: string
          id?: string
          last_used?: string | null
          name: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          bookings_count?: number
          config?: Json
          created_at?: string
          id?: string
          last_used?: string | null
          name?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          assigned_to: string | null
          channel_id: string
          created_at: string
          id: string
          message: string | null
          preferred_times: string[] | null
          prospect_email: string
          prospect_name: string
          scheduled_at: string | null
          status: string
        }
        Insert: {
          assigned_to?: string | null
          channel_id: string
          created_at?: string
          id?: string
          message?: string | null
          preferred_times?: string[] | null
          prospect_email: string
          prospect_name: string
          scheduled_at?: string | null
          status?: string
        }
        Update: {
          assigned_to?: string | null
          channel_id?: string
          created_at?: string
          id?: string
          message?: string | null
          preferred_times?: string[] | null
          prospect_email?: string
          prospect_name?: string
          scheduled_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "booking_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      chain_executions: {
        Row: {
          chain_id: string
          completed_at: string | null
          completed_schedules: string[]
          current_schedule_id: string | null
          error_message: string | null
          failed_schedules: string[]
          id: string
          started_at: string
          status: string
        }
        Insert: {
          chain_id: string
          completed_at?: string | null
          completed_schedules?: string[]
          current_schedule_id?: string | null
          error_message?: string | null
          failed_schedules?: string[]
          id?: string
          started_at?: string
          status?: string
        }
        Update: {
          chain_id?: string
          completed_at?: string | null
          completed_schedules?: string[]
          current_schedule_id?: string | null
          error_message?: string | null
          failed_schedules?: string[]
          id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "chain_executions_chain_id_fkey"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "dependency_chains"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_reports: {
        Row: {
          completed_at: string | null
          created_at: string
          data: Json
          id: string
          period_end: string
          period_start: string
          report_type: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          data?: Json
          id?: string
          period_end: string
          period_start: string
          report_type: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          data?: Json
          id?: string
          period_end?: string
          period_start?: string
          report_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_behaviors: {
        Row: {
          action_data: Json | null
          action_type: string
          device_type: string | null
          id: string
          location_data: Json | null
          page_url: string
          referrer: string | null
          session_id: string
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          device_type?: string | null
          id?: string
          location_data?: Json | null
          page_url: string
          referrer?: string | null
          session_id: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          device_type?: string | null
          id?: string
          location_data?: Json | null
          page_url?: string
          referrer?: string | null
          session_id?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dependency_chains: {
        Row: {
          created_at: string
          dependencies: Json
          description: string | null
          id: string
          name: string
          schedule_ids: string[]
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dependencies?: Json
          description?: string | null
          id?: string
          name: string
          schedule_ids?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dependencies?: Json
          description?: string | null
          id?: string
          name?: string
          schedule_ids?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      integration_configs: {
        Row: {
          config: Json
          created_at: string
          id: string
          integration_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          integration_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          integration_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_qualification_workflows: {
        Row: {
          agent_id: string
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          name: string
          qualification_criteria: Json
          questions: Json
          routing_rules: Json
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          name: string
          qualification_criteria?: Json
          questions?: Json
          routing_rules?: Json
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          name?: string
          qualification_criteria?: Json
          questions?: Json
          routing_rules?: Json
          updated_at?: string
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          agent_id: string
          channels: string[]
          context: Json | null
          created_at: string
          id: string
          message: string
          type: string
        }
        Insert: {
          agent_id: string
          channels?: string[]
          context?: Json | null
          created_at?: string
          id?: string
          message: string
          type: string
        }
        Update: {
          agent_id?: string
          channels?: string[]
          context?: Json | null
          created_at?: string
          id?: string
          message?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_rules: {
        Row: {
          agent_id: string
          channels: string[]
          condition: string
          created_at: string
          enabled: boolean
          id: string
          template: string
          type: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          channels?: string[]
          condition: string
          created_at?: string
          enabled?: boolean
          id?: string
          template: string
          type: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          channels?: string[]
          condition?: string
          created_at?: string
          enabled?: boolean
          id?: string
          template?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_rules_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          affiliate_id: string
          commission_amount: number
          converted_at: string | null
          created_at: string
          id: string
          paid_at: string | null
          referred_email: string
          referred_user_id: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_amount?: number
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referred_email: string
          referred_user_id?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referred_email?: string
          referred_user_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_dependencies: {
        Row: {
          condition: string
          created_at: string
          custom_condition: string | null
          delay: number | null
          id: string
          source_schedule_id: string
          target_schedule_id: string
        }
        Insert: {
          condition: string
          created_at?: string
          custom_condition?: string | null
          delay?: number | null
          id?: string
          source_schedule_id: string
          target_schedule_id: string
        }
        Update: {
          condition?: string
          created_at?: string
          custom_condition?: string | null
          delay?: number | null
          id?: string
          source_schedule_id?: string
          target_schedule_id?: string
        }
        Relationships: []
      }
      scheduled_executions: {
        Row: {
          agent_id: string | null
          created_at: string | null
          error_message: string | null
          executed_at: string | null
          id: string
          scheduled_for: string
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          scheduled_for: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          scheduled_for?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_executions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          monthly_executions_limit: number | null
          monthly_executions_used: number | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          monthly_executions_limit?: number | null
          monthly_executions_used?: number | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          monthly_executions_limit?: number | null
          monthly_executions_used?: number | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      template_purchases: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          completed_at: string | null
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_save: boolean | null
          created_at: string
          dashboard_layout: string | null
          default_agent_category: string | null
          id: string
          notifications: boolean | null
          onboarding_completed: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_save?: boolean | null
          created_at?: string
          dashboard_layout?: string | null
          default_agent_category?: string | null
          id?: string
          notifications?: boolean | null
          onboarding_completed?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_save?: boolean | null
          created_at?: string
          dashboard_layout?: string | null
          default_agent_category?: string | null
          id?: string
          notifications?: boolean | null
          onboarding_completed?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_channel_bookings: {
        Args: { channel_id: string }
        Returns: undefined
      }
      log_audit_event: {
        Args: {
          _action: string
          _agent_id: string
          _details?: Json
          _ip_address?: string
          _resource_id?: string
          _resource_type: string
          _user_agent?: string
          _user_id: string
        }
        Returns: string
      }
      reset_monthly_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      agent_status: "active" | "paused" | "stopped" | "error"
      agent_type:
        | "social_media_poster"
        | "inventory_monitor"
        | "customer_service"
        | "price_tracker"
        | "trend_analyzer"
        | "email_marketer"
      user_role: "admin" | "vip_creator" | "analyst" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status: ["active", "paused", "stopped", "error"],
      agent_type: [
        "social_media_poster",
        "inventory_monitor",
        "customer_service",
        "price_tracker",
        "trend_analyzer",
        "email_marketer",
      ],
      user_role: ["admin", "vip_creator", "analyst", "viewer"],
    },
  },
} as const
