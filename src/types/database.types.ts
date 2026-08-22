export type Json = string | number | boolean | null | {
  [key: string]: Json | undefined
} | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_events: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          group_id: string | null
          id: string
          metadata: Json | null
          reason: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          group_id?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          group_id?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
        }
        Relationships: [{
          foreignKeyName: "audit_events_actor_user_id_fkey"
          columns: ["actor_user_id"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }, {
          foreignKeyName: "audit_events_group_id_fkey"
          columns: ["group_id"]
          isOneToOne: false
          referencedRelation: "groups"
          referencedColumns: ["id"]
        }]
      }
      expense_allocations: {
        Row: {
          amount_idr: number
          balance_after_idr: number
          balance_before_idr: number
          created_at: string
          expense_id: string
          group_id: string
          group_member_id: string
          id: string
        }
        Insert: {
          amount_idr: number
          balance_after_idr: number
          balance_before_idr: number
          created_at?: string
          expense_id: string
          group_id: string
          group_member_id: string
          id?: string
        }
        Update: {
          amount_idr?: number
          balance_after_idr?: number
          balance_before_idr?: number
          created_at?: string
          expense_id?: string
          group_id?: string
          group_member_id?: string
          id?: string
        }
        Relationships: [{
          foreignKeyName: "fk_expense_allocations_expense"
          columns: ["group_id", "expense_id"]
          isOneToOne: false
          referencedRelation: "expenses"
          referencedColumns: ["group_id", "id"]
        }, {
          foreignKeyName: "fk_expense_allocations_member"
          columns: ["group_id", "group_member_id"]
          isOneToOne: false
          referencedRelation: "group_members"
          referencedColumns: ["group_id", "id"]
        }]
      }
      expenses: {
        Row: {
          amount_idr: number
          category: string
          created_at: string
          created_by: string
          description: string
          expense_date: string
          group_id: string
          id: string
          posted_at: string | null
          posted_by: string | null
          receipt_path: string | null
          status: string
          updated_at: string
          void_reason: string | null
          voided_at: string | null
        }
        Insert: {
          amount_idr: number
          category: string
          created_at?: string
          created_by: string
          description: string
          expense_date: string
          group_id: string
          id?: string
          posted_at?: string | null
          posted_by?: string | null
          receipt_path?: string | null
          status?: string
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
        }
        Update: {
          amount_idr?: number
          category?: string
          created_at?: string
          created_by?: string
          description?: string
          expense_date?: string
          group_id?: string
          id?: string
          posted_at?: string | null
          posted_by?: string | null
          receipt_path?: string | null
          status?: string
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
        }
        Relationships: [{
          foreignKeyName: "expenses_created_by_fkey"
          columns: ["created_by"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }, {
          foreignKeyName: "expenses_group_id_fkey"
          columns: ["group_id"]
          isOneToOne: false
          referencedRelation: "groups"
          referencedColumns: ["id"]
        }, {
          foreignKeyName: "expenses_posted_by_fkey"
          columns: ["posted_by"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }]
      }
      group_cash_balances: {
        Row: {
          balance_idr: number
          group_id: string
          updated_at: string
        }
        Insert: {
          balance_idr?: number
          group_id: string
          updated_at?: string
        }
        Update: {
          balance_idr?: number
          group_id?: string
          updated_at?: string
        }
        Relationships: [{
          foreignKeyName: "group_cash_balances_group_id_fkey"
          columns: ["group_id"]
          isOneToOne: true
          referencedRelation: "groups"
          referencedColumns: ["id"]
        }]
      }
      group_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          group_id: string
          id: string
          invite_code: string
          invited_by: string | null
          role: string
          status: string
          student_name: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          group_id: string
          id?: string
          invite_code: string
          invited_by?: string | null
          role?: string
          status?: string
          student_name?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          group_id?: string
          id?: string
          invite_code?: string
          invited_by?: string | null
          role?: string
          status?: string
          student_name?: string | null
        }
        Relationships: [{
          foreignKeyName: "group_invitations_group_id_fkey"
          columns: ["group_id"]
          isOneToOne: false
          referencedRelation: "groups"
          referencedColumns: ["id"]
        }, {
          foreignKeyName: "group_invitations_invited_by_fkey"
          columns: ["invited_by"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }]
      }
      group_members: {
        Row: {
          active: boolean
          created_at: string
          display_name: string
          group_id: string
          id: string
          role: string
          student_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_name: string
          group_id: string
          id?: string
          role?: string
          student_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_name?: string
          group_id?: string
          id?: string
          role?: string
          student_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [{
          foreignKeyName: "group_members_group_id_fkey"
          columns: ["group_id"]
          isOneToOne: false
          referencedRelation: "groups"
          referencedColumns: ["id"]
        }, {
          foreignKeyName: "group_members_user_id_fkey"
          columns: ["user_id"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }]
      }
      groups: {
        Row: {
          created_at: string
          id: string
          monthly_target_idr: number
          name: string
          public_report_enabled: boolean
          public_slug: string | null
          school_name: string | null
          start_month: string | null
          logo_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_target_idr?: number
          name: string
          public_report_enabled?: boolean
          public_slug?: string | null
          school_name?: string | null
          start_month?: string | null
          logo_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          monthly_target_idr?: number
          name?: string
          public_report_enabled?: boolean
          public_slug?: string | null
          school_name?: string | null
          start_month?: string | null
          logo_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      idempotency_keys: {
        Row: {
          actor_user_id: string
          created_at: string
          group_id: string
          id: string
          key: string
          request_hash: string
          response_body: Json | null
        }
        Insert: {
          actor_user_id: string
          created_at?: string
          group_id: string
          id?: string
          key: string
          request_hash: string
          response_body?: Json | null
        }
        Update: {
          actor_user_id?: string
          created_at?: string
          group_id?: string
          id?: string
          key?: string
          request_hash?: string
          response_body?: Json | null
        }
        Relationships: [{
          foreignKeyName: "idempotency_keys_actor_user_id_fkey"
          columns: ["actor_user_id"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }, {
          foreignKeyName: "idempotency_keys_group_id_fkey"
          columns: ["group_id"]
          isOneToOne: false
          referencedRelation: "groups"
          referencedColumns: ["id"]
        }]
      }
      member_balances: {
        Row: {
          balance_idr: number
          group_id: string
          group_member_id: string
          id: string
          updated_at: string
        }
        Insert: {
          balance_idr?: number
          group_id: string
          group_member_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          balance_idr?: number
          group_id?: string
          group_member_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [{
          foreignKeyName: "fk_member_balances_member"
          columns: ["group_id", "group_member_id"]
          isOneToOne: true
          referencedRelation: "group_members"
          referencedColumns: ["group_id", "id"]
        }]
      }
      payment_ocr_results: {
        Row: {
          error_code: string | null
          extracted_data: Json | null
          group_id: string
          id: string
          model: string
          processed_at: string
          requested_by: string | null
          status: string
          submission_id: string
        }
        Insert: {
          error_code?: string | null
          extracted_data?: Json | null
          group_id: string
          id?: string
          model: string
          processed_at?: string
          requested_by?: string | null
          status?: string
          submission_id: string
        }
        Update: {
          error_code?: string | null
          extracted_data?: Json | null
          group_id?: string
          id?: string
          model?: string
          processed_at?: string
          requested_by?: string | null
          status?: string
          submission_id?: string
        }
        Relationships: [{
          foreignKeyName: "fk_payment_ocr_submission"
          columns: ["group_id", "submission_id"]
          isOneToOne: false
          referencedRelation: "payment_submissions"
          referencedColumns: ["group_id", "id"]
        }, {
          foreignKeyName: "payment_ocr_results_group_id_fkey"
          columns: ["group_id"]
          isOneToOne: false
          referencedRelation: "groups"
          referencedColumns: ["id"]
        }, {
          foreignKeyName: "payment_ocr_results_requested_by_fkey"
          columns: ["requested_by"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }]
      }
      payment_submissions: {
        Row: {
          amount_idr: number
          archived_at: string | null
          catatan: string | null
          created_at: string
          deleted_at: string | null
          group_id: string
          group_member_id: string
          id: string
          period_allocations: Json | null
          period_label: string
          retain_until: string | null
          sha256: string | null
          status: string
          storage_path: string
          transfer_date: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
          void_reason: string | null
        }
        Insert: {
          amount_idr: number
          archived_at?: string | null
          catatan?: string | null
          created_at?: string
          deleted_at?: string | null
          group_id: string
          group_member_id: string
          id?: string
          period_allocations?: Json | null
          period_label: string
          retain_until?: string | null
          sha256?: string | null
          status?: string
          storage_path: string
          transfer_date: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          void_reason?: string | null
        }
        Update: {
          amount_idr?: number
          archived_at?: string | null
          catatan?: string | null
          created_at?: string
          deleted_at?: string | null
          group_id?: string
          group_member_id?: string
          id?: string
          period_allocations?: Json | null
          period_label?: string
          retain_until?: string | null
          sha256?: string | null
          status?: string
          storage_path?: string
          transfer_date?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          void_reason?: string | null
        }
        Relationships: [{
          foreignKeyName: "fk_payment_submissions_member"
          columns: ["group_id", "group_member_id"]
          isOneToOne: false
          referencedRelation: "group_members"
          referencedColumns: ["group_id", "id"]
        }, {
          foreignKeyName: "payment_submissions_group_id_fkey"
          columns: ["group_id"]
          isOneToOne: false
          referencedRelation: "groups"
          referencedColumns: ["id"]
        }, {
          foreignKeyName: "payment_submissions_verified_by_fkey"
          columns: ["verified_by"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reconciliations: {
        Row: {
          app_balance_idr: number
          bank_balance_idr: number
          created_at: string
          created_by: string
          difference_idr: number
          group_id: string
          id: string
          note: string | null
          statement_date: string
        }
        Insert: {
          app_balance_idr: number
          bank_balance_idr: number
          created_at?: string
          created_by: string
          difference_idr: number
          group_id: string
          id?: string
          note?: string | null
          statement_date: string
        }
        Update: {
          app_balance_idr?: number
          bank_balance_idr?: number
          created_at?: string
          created_by?: string
          difference_idr?: number
          group_id?: string
          id?: string
          note?: string | null
          statement_date?: string
        }
        Relationships: [{
          foreignKeyName: "reconciliations_created_by_fkey"
          columns: ["created_by"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }, {
          foreignKeyName: "reconciliations_group_id_fkey"
          columns: ["group_id"]
          isOneToOne: false
          referencedRelation: "groups"
          referencedColumns: ["id"]
        }]
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      accept_group_invitation: {
        Args: { p_invite_code: string }
        Returns: Json
      }
      create_group: {
        Args: {
          p_monthly_target_idr?: number
          p_name: string
          p_school_name?: string
        }
        Returns: Json
      }
      create_payment_submission: {
        Args: {
          p_amount_idr: number
          p_catatan?: string
          p_group_id: string
          p_period_label: string
          p_sha256?: string
          p_storage_path: string
          p_transfer_date: string
        }
        Returns: Json
      }
      current_user_id: { Args: never; Returns: string }
      invite_member: {
        Args: {
          p_display_name: string
          p_email: string
          p_group_id: string
          p_role?: string
          p_student_name?: string
        }
        Returns: Json
      }
      is_group_admin: {
        Args: { p_group_id: string; p_user_id?: string }
        Returns: boolean
      } | { Args: { p_group_id: string; p_user_id?: string }; Returns: boolean }
      is_group_member: {
        Args: { p_group_id: string; p_user_id?: string }
        Returns: boolean
      } | { Args: { p_group_id: string; p_user_id?: string }; Returns: boolean }
      is_group_treasurer_or_admin: {
        Args: { p_group_id: string; p_user_id?: string }
        Returns: boolean
      } | { Args: { p_group_id: string; p_user_id?: string }; Returns: boolean }
      post_expense: {
        Args: {
          p_amount_idr: number
          p_category: string
          p_description: string
          p_expense_date: string
          p_group_id: string
          p_idempotency_key?: string
          p_member_ids: string[]
          p_receipt_path?: string
        }
        Returns: Json
      }
      preview_expense: {
        Args: {
          p_amount_idr: number
          p_group_id: string
          p_member_ids: string[]
        }
        Returns: Json
      }
      set_group_role: {
        Args: { p_group_id: string; p_member_id: string; p_role: string }
        Returns: Json
      }
      upsert_current_user_profile: {
        Args: {
          p_avatar_url?: string
          p_display_name: string
          p_email: string
        }
        Returns: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      } | {
        Args: {
          p_avatar_url?: string
          p_display_name: string
          p_email: string
          p_user_id?: string
        }
        Returns: Json
      }
      verify_payment: {
        Args: {
          p_group_id: string
          p_idempotency_key?: string
          p_submission_id: string
        }
        Returns: Json
      }
      void_expense: {
        Args: {
          p_expense_id: string
          p_group_id: string
          p_idempotency_key?: string
          p_reason: string
        }
        Returns: Json
      }
      void_verified_payment: {
        Args: {
          p_group_id: string
          p_idempotency_key?: string
          p_reason: string
          p_submission_id: string
        }
        Returns: Json
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
