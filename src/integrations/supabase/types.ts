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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      availability: {
        Row: {
          blocked_date: string
          created_at: string | null
          id: string
          reason: string | null
          user_id: string | null
        }
        Insert: {
          blocked_date: string
          created_at?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          blocked_date?: string
          created_at?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cancellation_surveys: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          plan: string | null
          reason: string | null
          retention_accepted: boolean | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          plan?: string | null
          reason?: string | null
          retention_accepted?: boolean | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          plan?: string | null
          reason?: string | null
          retention_accepted?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          participant_a: string | null
          participant_b: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participant_a?: string | null
          participant_b?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participant_a?: string | null
          participant_b?: string | null
        }
        Relationships: []
      }
      fan_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          professional_profile_id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          professional_profile_id: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          professional_profile_id?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fan_messages_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fan_subscriptions: {
        Row: {
          cancelled_at: string | null
          fan_user_id: string
          id: string
          professional_profile_id: string
          status: string | null
          subscribed_at: string | null
        }
        Insert: {
          cancelled_at?: string | null
          fan_user_id: string
          id?: string
          professional_profile_id: string
          status?: string | null
          subscribed_at?: string | null
        }
        Update: {
          cancelled_at?: string | null
          fan_user_id?: string
          id?: string
          professional_profile_id?: string
          status?: string | null
          subscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fan_subscriptions_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      flash_bookings: {
        Row: {
          agreed_price: number | null
          created_at: string | null
          created_by: string | null
          event_date: string | null
          event_description: string | null
          event_location: string | null
          id: string
          professional_name: string
          professional_role: string | null
          professional_user_id: string | null
          requester_contact: string
          requester_name: string
          status: string | null
        }
        Insert: {
          agreed_price?: number | null
          created_at?: string | null
          created_by?: string | null
          event_date?: string | null
          event_description?: string | null
          event_location?: string | null
          id?: string
          professional_name: string
          professional_role?: string | null
          professional_user_id?: string | null
          requester_contact: string
          requester_name: string
          status?: string | null
        }
        Update: {
          agreed_price?: number | null
          created_at?: string | null
          created_by?: string | null
          event_date?: string | null
          event_description?: string | null
          event_location?: string | null
          id?: string
          professional_name?: string
          professional_role?: string | null
          professional_user_id?: string | null
          requester_contact?: string
          requester_name?: string
          status?: string | null
        }
        Relationships: []
      }
      flash_jobs: {
        Row: {
          created_at: string | null
          description: string | null
          employer_id: string
          expires_at: string | null
          id: string
          location: string | null
          pay: string | null
          role_needed: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          employer_id: string
          expires_at?: string | null
          id?: string
          location?: string | null
          pay?: string | null
          role_needed?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          employer_id?: string
          expires_at?: string | null
          id?: string
          location?: string | null
          pay?: string | null
          role_needed?: string | null
          title?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          read: boolean | null
          sender_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          read?: boolean | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          read?: boolean | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          annual_billing: boolean | null
          audio_embed_url: string | null
          audio_url: string | null
          bio: string | null
          birthday: string | null
          category: string | null
          created_at: string | null
          display_name: string | null
          genres: string[] | null
          hourly_rate: number | null
          id: string
          instagram: string | null
          is_flash_active: boolean | null
          is_live: boolean | null
          is_premium: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          phone: string | null
          photo_url: string | null
          role: string | null
          score: number | null
          specialty: string | null
          stream_title: string | null
          stream_url: string | null
          subscription_tier: string | null
          tiktok: string | null
          trial_started_at: string | null
          updated_at: string | null
          user_id: string
          validation_status: string | null
          validation_submitted_at: string | null
          zone: string | null
        }
        Insert: {
          annual_billing?: boolean | null
          audio_embed_url?: string | null
          audio_url?: string | null
          bio?: string | null
          birthday?: string | null
          category?: string | null
          created_at?: string | null
          display_name?: string | null
          genres?: string[] | null
          hourly_rate?: number | null
          id?: string
          instagram?: string | null
          is_flash_active?: boolean | null
          is_live?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          score?: number | null
          specialty?: string | null
          stream_title?: string | null
          stream_url?: string | null
          subscription_tier?: string | null
          tiktok?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
          user_id: string
          validation_status?: string | null
          validation_submitted_at?: string | null
          zone?: string | null
        }
        Update: {
          annual_billing?: boolean | null
          audio_embed_url?: string | null
          audio_url?: string | null
          bio?: string | null
          birthday?: string | null
          category?: string | null
          created_at?: string | null
          display_name?: string | null
          genres?: string[] | null
          hourly_rate?: number | null
          id?: string
          instagram?: string | null
          is_flash_active?: boolean | null
          is_live?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          score?: number | null
          specialty?: string | null
          stream_title?: string | null
          stream_url?: string | null
          subscription_tier?: string | null
          tiktok?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
          user_id?: string
          validation_status?: string | null
          validation_submitted_at?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      retention_discounts: {
        Row: {
          created_at: string | null
          discount_percent: number | null
          duration_months: number | null
          id: string
          plan: string | null
          used: boolean | null
          user_id: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percent?: number | null
          duration_months?: number | null
          id?: string
          plan?: string | null
          used?: boolean | null
          user_id?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percent?: number | null
          duration_months?: number | null
          id?: string
          plan?: string | null
          used?: boolean | null
          user_id?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          event_type: string | null
          id: string
          rating: number
          reviewed_user_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          event_type?: string | null
          id?: string
          rating: number
          reviewed_user_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          event_type?: string | null
          id?: string
          rating?: number
          reviewed_user_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: string
          profile_id: string
          vote_date: string
          voted_at: string | null
          voter_id: string
        }
        Insert: {
          id?: string
          profile_id: string
          vote_date?: string
          voted_at?: string | null
          voter_id: string
        }
        Update: {
          id?: string
          profile_id?: string
          vote_date?: string
          voted_at?: string | null
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_vote_count: { Args: { p_profile_id: string }; Returns: number }
      has_voted_today: {
        Args: { p_profile_id: string; p_voter_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
