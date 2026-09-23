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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_actividad_ocultada: {
        Row: {
          clave: string
          ocultada_at: string
          ocultada_por: string | null
        }
        Insert: {
          clave: string
          ocultada_at?: string
          ocultada_por?: string | null
        }
        Update: {
          clave?: string
          ocultada_at?: string
          ocultada_por?: string | null
        }
        Relationships: []
      }
      admin_activity_seen: {
        Row: {
          seen_at: string
          user_id: string
        }
        Insert: {
          seen_at?: string
          user_id: string
        }
        Update: {
          seen_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_alertas_descartadas: {
        Row: {
          clave: string
          descartada_at: string
          descartada_por: string | null
          reevaluar_en: string | null
        }
        Insert: {
          clave: string
          descartada_at?: string
          descartada_por?: string | null
          reevaluar_en?: string | null
        }
        Update: {
          clave?: string
          descartada_at?: string
          descartada_por?: string | null
          reevaluar_en?: string | null
        }
        Relationships: []
      }
      alert_preferences: {
        Row: {
          bolo_24h: boolean
          email_bolo_24h: boolean
          email_flash: boolean
          notif_flash: boolean
          notif_messages: boolean
          notif_top_weekend: boolean
          nuevos_bolos: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          bolo_24h?: boolean
          email_bolo_24h?: boolean
          email_flash?: boolean
          notif_flash?: boolean
          notif_messages?: boolean
          notif_top_weekend?: boolean
          nuevos_bolos?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          bolo_24h?: boolean
          email_bolo_24h?: boolean
          email_flash?: boolean
          notif_flash?: boolean
          notif_messages?: boolean
          notif_top_weekend?: boolean
          nuevos_bolos?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          detalle: string | null
          device: string | null
          event_name: string
          id: number
          path: string | null
          referrer: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          detalle?: string | null
          device?: string | null
          event_name: string
          id?: number
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          detalle?: string | null
          device?: string | null
          event_name?: string
          id?: number
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          event_date: string
          id: string
          location: string | null
          notes: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_date: string
          id?: string
          location?: string | null
          notes?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_date?: string
          id?: string
          location?: string | null
          notes?: string | null
          title?: string
          user_id?: string
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
      client_errors: {
        Row: {
          component_stack: string | null
          created_at: string
          id: string
          message: string | null
          stack: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          component_stack?: string | null
          created_at?: string
          id?: string
          message?: string | null
          stack?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          component_stack?: string | null
          created_at?: string
          id?: string
          message?: string | null
          stack?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contact_events: {
        Row: {
          created_at: string
          id: string
          professional_role: string
          professional_zone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          professional_role: string
          professional_zone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          professional_role?: string
          professional_zone?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          city: string | null
          contract_html: string | null
          contratante_nombre: string | null
          created_at: string | null
          empresa_nombre: string | null
          event_date: string | null
          event_name: string | null
          event_type: string | null
          id: string
          precio_neto: number | null
          professional_name: string | null
          professional_role: string | null
          ref: string
          retencion: number | null
          signed_at: string | null
          user_id: string
          venue: string | null
        }
        Insert: {
          city?: string | null
          contract_html?: string | null
          contratante_nombre?: string | null
          created_at?: string | null
          empresa_nombre?: string | null
          event_date?: string | null
          event_name?: string | null
          event_type?: string | null
          id?: string
          precio_neto?: number | null
          professional_name?: string | null
          professional_role?: string | null
          ref: string
          retencion?: number | null
          signed_at?: string | null
          user_id: string
          venue?: string | null
        }
        Update: {
          city?: string | null
          contract_html?: string | null
          contratante_nombre?: string | null
          created_at?: string | null
          empresa_nombre?: string | null
          event_date?: string | null
          event_name?: string | null
          event_type?: string | null
          id?: string
          precio_neto?: number | null
          professional_name?: string | null
          professional_role?: string | null
          ref?: string
          retencion?: number | null
          signed_at?: string | null
          user_id?: string
          venue?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          deleted_by_a: boolean
          deleted_by_b: boolean
          id: string
          last_message_at: string | null
          participant_a: string | null
          participant_b: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_by_a?: boolean
          deleted_by_b?: boolean
          id?: string
          last_message_at?: string | null
          participant_a?: string | null
          participant_b?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_by_a?: boolean
          deleted_by_b?: boolean
          id?: string
          last_message_at?: string | null
          participant_a?: string | null
          participant_b?: string | null
        }
        Relationships: []
      }
      dance_socials: {
        Row: {
          city: string
          created_at: string | null
          description: string | null
          event_date: string
          event_name: string
          id: string
          link_url: string | null
          style: string
          user_id: string
          venue: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          description?: string | null
          event_date: string
          event_name: string
          id?: string
          link_url?: string | null
          style: string
          user_id: string
          venue?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_name?: string
          id?: string
          link_url?: string | null
          style?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: []
      }
      edge_function_rate_limit_log: {
        Row: {
          client_ip: string
          created_at: string
          endpoint: string
          id: number
        }
        Insert: {
          client_ip: string
          created_at?: string
          endpoint: string
          id?: never
        }
        Update: {
          client_ip?: string
          created_at?: string
          endpoint?: string
          id?: never
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          id: string
          sent_at: string
          type: string
          user_id: string
        }
        Insert: {
          id?: string
          sent_at?: string
          type: string
          user_id: string
        }
        Update: {
          id?: string
          sent_at?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          html: string
          id: string
          sent_at: string
          subject: string
          to_email: string
          type: string
          user_id: string | null
        }
        Insert: {
          html: string
          id?: string
          sent_at?: string
          subject: string
          to_email: string
          type: string
          user_id?: string | null
        }
        Update: {
          html?: string
          id?: string
          sent_at?: string
          subject?: string
          to_email?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      event_request_responses: {
        Row: {
          chosen_at: string | null
          created_at: string
          hired_at: string | null
          id: string
          message: string | null
          professional_user_id: string
          request_id: string
          review_asked_at: string | null
          slot_id: string | null
          status: string
        }
        Insert: {
          chosen_at?: string | null
          created_at?: string
          hired_at?: string | null
          id?: string
          message?: string | null
          professional_user_id: string
          request_id: string
          review_asked_at?: string | null
          slot_id?: string | null
          status?: string
        }
        Update: {
          chosen_at?: string | null
          created_at?: string
          hired_at?: string | null
          id?: string
          message?: string | null
          professional_user_id?: string
          request_id?: string
          review_asked_at?: string | null
          slot_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_request_responses_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_request_responses_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "event_request_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      event_request_slots: {
        Row: {
          created_at: string
          id: string
          request_id: string
          role: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_id: string
          role: string
        }
        Update: {
          created_at?: string
          id?: string
          request_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_request_slots_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      event_requests: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          city: string
          client_name: string
          client_user_id: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          estilos: string[] | null
          event_date: string | null
          event_dates: string[] | null
          event_type: string
          expires_at: string | null
          id: string
          roles_needed: string[] | null
          status: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          city: string
          client_name: string
          client_user_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          estilos?: string[] | null
          event_date?: string | null
          event_dates?: string[] | null
          event_type: string
          expires_at?: string | null
          id?: string
          roles_needed?: string[] | null
          status?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          city?: string
          client_name?: string
          client_user_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          estilos?: string[] | null
          event_date?: string | null
          event_dates?: string[] | null
          event_type?: string
          expires_at?: string | null
          id?: string
          roles_needed?: string[] | null
          status?: string | null
        }
        Relationships: []
      }
      fan_club_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          profile_id: string | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          profile_id?: string | null
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          profile_id?: string | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fan_club_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
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
          professional_note: string | null
          professional_role: string | null
          professional_user_id: string | null
          reminder_sent_at: string | null
          requester_contact: string
          requester_name: string
          source: string
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
          professional_note?: string | null
          professional_role?: string | null
          professional_user_id?: string | null
          reminder_sent_at?: string | null
          requester_contact: string
          requester_name: string
          source?: string
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
          professional_note?: string | null
          professional_role?: string | null
          professional_user_id?: string | null
          reminder_sent_at?: string | null
          requester_contact?: string
          requester_name?: string
          source?: string
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
      leads: {
        Row: {
          article_path: string | null
          converted_at: string | null
          created_at: string | null
          email: string
          id: string
          intent: string | null
          lead_region: string | null
          lead_role: string | null
          source: string
        }
        Insert: {
          article_path?: string | null
          converted_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          intent?: string | null
          lead_region?: string | null
          lead_role?: string | null
          source?: string
        }
        Update: {
          article_path?: string | null
          converted_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          intent?: string | null
          lead_region?: string | null
          lead_role?: string | null
          source?: string
        }
        Relationships: []
      }
      live_sessions: {
        Row: {
          last_ping: string
          streamer_id: string
          viewer_id: string
        }
        Insert: {
          last_ping?: string
          streamer_id: string
          viewer_id: string
        }
        Update: {
          last_ping?: string
          streamer_id?: string
          viewer_id?: string
        }
        Relationships: []
      }
      mcp_query_log: {
        Row: {
          action: string
          budget_requested: number | null
          city_requested: string | null
          created_at: string
          id: string
          led_to_booking: boolean | null
          raw_params: Json | null
          result_count: number | null
          role_requested: string | null
          session_id: string | null
        }
        Insert: {
          action: string
          budget_requested?: number | null
          city_requested?: string | null
          created_at?: string
          id?: string
          led_to_booking?: boolean | null
          raw_params?: Json | null
          result_count?: number | null
          role_requested?: string | null
          session_id?: string | null
        }
        Update: {
          action?: string
          budget_requested?: number | null
          city_requested?: string | null
          created_at?: string
          id?: string
          led_to_booking?: boolean | null
          raw_params?: Json | null
          result_count?: number | null
          role_requested?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          read: boolean | null
          sender_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          read?: boolean | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
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
      newsletter_leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_vote_counts: {
        Row: {
          profile_id: string
          vote_count: number
        }
        Insert: {
          profile_id: string
          vote_count?: number
        }
        Update: {
          profile_id?: string
          vote_count?: number
        }
        Relationships: []
      }
      profile_business_views: {
        Row: {
          created_at: string
          id: string
          viewed_user_id: string
          viewer_zone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          viewed_user_id: string
          viewer_zone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          viewed_user_id?: string
          viewer_zone?: string | null
        }
        Relationships: []
      }
      profile_deletions: {
        Row: {
          acknowledged: boolean
          bookings_created: number
          bookings_received: number
          claim_user_id: string | null
          conversations: number
          days_active: number | null
          deleted_at: string
          exit_comment: string | null
          exit_reason: string | null
          favorited_by: number
          favorites_made: number
          had_bio: boolean
          had_media: boolean
          had_photo: boolean
          hourly_rate: number | null
          id: string
          last_activity_at: string | null
          messages_received: number
          messages_sent: number
          profile_score: number | null
          reviews_received: number
          role: string | null
          was_verified: boolean
          zone: string | null
        }
        Insert: {
          acknowledged?: boolean
          bookings_created?: number
          bookings_received?: number
          claim_user_id?: string | null
          conversations?: number
          days_active?: number | null
          deleted_at?: string
          exit_comment?: string | null
          exit_reason?: string | null
          favorited_by?: number
          favorites_made?: number
          had_bio?: boolean
          had_media?: boolean
          had_photo?: boolean
          hourly_rate?: number | null
          id?: string
          last_activity_at?: string | null
          messages_received?: number
          messages_sent?: number
          profile_score?: number | null
          reviews_received?: number
          role?: string | null
          was_verified?: boolean
          zone?: string | null
        }
        Update: {
          acknowledged?: boolean
          bookings_created?: number
          bookings_received?: number
          claim_user_id?: string | null
          conversations?: number
          days_active?: number | null
          deleted_at?: string
          exit_comment?: string | null
          exit_reason?: string | null
          favorited_by?: number
          favorites_made?: number
          had_bio?: boolean
          had_media?: boolean
          had_photo?: boolean
          hourly_rate?: number | null
          id?: string
          last_activity_at?: string | null
          messages_received?: number
          messages_sent?: number
          profile_score?: number | null
          reviews_received?: number
          role?: string | null
          was_verified?: boolean
          zone?: string | null
        }
        Relationships: []
      }
      profile_posts: {
        Row: {
          content: string
          created_at: string
          fan_tier: string | null
          id: string
          media_url: string | null
          post_type: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          fan_tier?: string | null
          id?: string
          media_url?: string | null
          post_type?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          fan_tier?: string | null
          id?: string
          media_url?: string | null
          post_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          created_at: string
          id: number
          profile_user_id: string
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          profile_user_id: string
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          profile_user_id?: string
          viewer_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_seen_at: string | null
          ai_moderation_flagged: boolean
          ai_moderation_reason: string | null
          annual_billing: boolean | null
          audio_embed_url: string | null
          audio_session_urls: string[] | null
          audio_url: string | null
          available_weekdays: number[] | null
          bg_music_url: string | null
          bio: string | null
          bio_video_url: string | null
          birthday: string | null
          blocked_dates: string[] | null
          category: string | null
          city_ref: string | null
          class_price: number | null
          class_styles: string[] | null
          conditions_note: string | null
          created_at: string | null
          dance_level: string | null
          dance_role: string | null
          display_name: string | null
          email: string | null
          email_opt_out: boolean
          excluded_services: string[] | null
          fast_responder_count: number
          genres: string[] | null
          google_review_url: string | null
          holiday_surcharge_pct: number | null
          hourly_rate: number | null
          id: string
          instagram: string | null
          is_early_adopter: boolean
          is_early_adopter_override: boolean
          is_flash_active: boolean | null
          is_live: boolean | null
          is_premium: boolean | null
          is_primary: boolean
          is_public: boolean
          is_seed: boolean
          is_seed_profile: boolean
          is_verified: boolean | null
          languages: string[] | null
          min_hours: number | null
          min_notice_hours: number | null
          night_surcharge_pct: number | null
          offers_classes: boolean
          overtime_after_hours: number | null
          overtime_surcharge_pct: number | null
          payment_days_max: number | null
          phone: string | null
          photo_url: string | null
          portfolio_urls: string[] | null
          priority_badge_until: string | null
          referral_code: string | null
          region: string | null
          role: string | null
          roles: string[]
          score: number | null
          seeking_dance_partner: boolean
          show_online: boolean
          specialty: string | null
          stream_title: string | null
          stream_url: string | null
          subscription_tier: string | null
          tiktok: string | null
          travel_fee: number | null
          travel_free_km: number | null
          trial_started_at: string | null
          uniform_provided_by: string | null
          updated_at: string | null
          user_id: string
          validation_status: string | null
          validation_submitted_at: string | null
          video_session_urls: string[] | null
          zone: string | null
        }
        Insert: {
          admin_seen_at?: string | null
          ai_moderation_flagged?: boolean
          ai_moderation_reason?: string | null
          annual_billing?: boolean | null
          audio_embed_url?: string | null
          audio_session_urls?: string[] | null
          audio_url?: string | null
          available_weekdays?: number[] | null
          bg_music_url?: string | null
          bio?: string | null
          bio_video_url?: string | null
          birthday?: string | null
          blocked_dates?: string[] | null
          category?: string | null
          city_ref?: string | null
          class_price?: number | null
          class_styles?: string[] | null
          conditions_note?: string | null
          created_at?: string | null
          dance_level?: string | null
          dance_role?: string | null
          display_name?: string | null
          email?: string | null
          email_opt_out?: boolean
          excluded_services?: string[] | null
          fast_responder_count?: number
          genres?: string[] | null
          google_review_url?: string | null
          holiday_surcharge_pct?: number | null
          hourly_rate?: number | null
          id?: string
          instagram?: string | null
          is_early_adopter?: boolean
          is_early_adopter_override?: boolean
          is_flash_active?: boolean | null
          is_live?: boolean | null
          is_premium?: boolean | null
          is_primary?: boolean
          is_public?: boolean
          is_seed?: boolean
          is_seed_profile?: boolean
          is_verified?: boolean | null
          languages?: string[] | null
          min_hours?: number | null
          min_notice_hours?: number | null
          night_surcharge_pct?: number | null
          offers_classes?: boolean
          overtime_after_hours?: number | null
          overtime_surcharge_pct?: number | null
          payment_days_max?: number | null
          phone?: string | null
          photo_url?: string | null
          portfolio_urls?: string[] | null
          priority_badge_until?: string | null
          referral_code?: string | null
          region?: string | null
          role?: string | null
          roles?: string[]
          score?: number | null
          seeking_dance_partner?: boolean
          show_online?: boolean
          specialty?: string | null
          stream_title?: string | null
          stream_url?: string | null
          subscription_tier?: string | null
          tiktok?: string | null
          travel_fee?: number | null
          travel_free_km?: number | null
          trial_started_at?: string | null
          uniform_provided_by?: string | null
          updated_at?: string | null
          user_id: string
          validation_status?: string | null
          validation_submitted_at?: string | null
          video_session_urls?: string[] | null
          zone?: string | null
        }
        Update: {
          admin_seen_at?: string | null
          ai_moderation_flagged?: boolean
          ai_moderation_reason?: string | null
          annual_billing?: boolean | null
          audio_embed_url?: string | null
          audio_session_urls?: string[] | null
          audio_url?: string | null
          available_weekdays?: number[] | null
          bg_music_url?: string | null
          bio?: string | null
          bio_video_url?: string | null
          birthday?: string | null
          blocked_dates?: string[] | null
          category?: string | null
          city_ref?: string | null
          class_price?: number | null
          class_styles?: string[] | null
          conditions_note?: string | null
          created_at?: string | null
          dance_level?: string | null
          dance_role?: string | null
          display_name?: string | null
          email?: string | null
          email_opt_out?: boolean
          excluded_services?: string[] | null
          fast_responder_count?: number
          genres?: string[] | null
          google_review_url?: string | null
          holiday_surcharge_pct?: number | null
          hourly_rate?: number | null
          id?: string
          instagram?: string | null
          is_early_adopter?: boolean
          is_early_adopter_override?: boolean
          is_flash_active?: boolean | null
          is_live?: boolean | null
          is_premium?: boolean | null
          is_primary?: boolean
          is_public?: boolean
          is_seed?: boolean
          is_seed_profile?: boolean
          is_verified?: boolean | null
          languages?: string[] | null
          min_hours?: number | null
          min_notice_hours?: number | null
          night_surcharge_pct?: number | null
          offers_classes?: boolean
          overtime_after_hours?: number | null
          overtime_surcharge_pct?: number | null
          payment_days_max?: number | null
          phone?: string | null
          photo_url?: string | null
          portfolio_urls?: string[] | null
          priority_badge_until?: string | null
          referral_code?: string | null
          region?: string | null
          role?: string | null
          roles?: string[]
          score?: number | null
          seeking_dance_partner?: boolean
          show_online?: boolean
          specialty?: string | null
          stream_title?: string | null
          stream_url?: string | null
          subscription_tier?: string | null
          tiktok?: string | null
          travel_fee?: number | null
          travel_free_km?: number | null
          trial_started_at?: string | null
          uniform_provided_by?: string | null
          updated_at?: string | null
          user_id?: string
          validation_status?: string | null
          validation_submitted_at?: string | null
          video_session_urls?: string[] | null
          zone?: string | null
        }
        Relationships: []
      }
      promo_code_uses: {
        Row: {
          code_id: string | null
          id: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          code_id?: string | null
          id?: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          code_id?: string | null
          id?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_uses_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number
          description: string | null
          discount_percent: number
          id: string
          is_active: boolean
          max_uses: number | null
          plan_id: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number
          description?: string | null
          discount_percent: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          plan_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number
          description?: string | null
          discount_percent?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          plan_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          invitee_user_id: string
          inviter_user_id: string
          rewarded: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_user_id: string
          inviter_user_id: string
          rewarded?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          invitee_user_id?: string
          inviter_user_id?: string
          rewarded?: boolean
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
          approved: boolean
          comment: string | null
          created_at: string | null
          event_date: string | null
          event_type: string | null
          id: string
          rating: number
          rejected_at: string | null
          reviewed_user_id: string | null
          reviewer_avatar: string | null
          reviewer_email: string | null
          reviewer_id: string | null
          reviewer_name: string | null
          reviewer_role: string | null
        }
        Insert: {
          approved?: boolean
          comment?: string | null
          created_at?: string | null
          event_date?: string | null
          event_type?: string | null
          id?: string
          rating: number
          rejected_at?: string | null
          reviewed_user_id?: string | null
          reviewer_avatar?: string | null
          reviewer_email?: string | null
          reviewer_id?: string | null
          reviewer_name?: string | null
          reviewer_role?: string | null
        }
        Update: {
          approved?: boolean
          comment?: string | null
          created_at?: string | null
          event_date?: string | null
          event_type?: string | null
          id?: string
          rating?: number
          rejected_at?: string | null
          reviewed_user_id?: string | null
          reviewer_avatar?: string | null
          reviewer_email?: string | null
          reviewer_id?: string | null
          reviewer_name?: string | null
          reviewer_role?: string | null
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
      wedding_leads: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          city: string | null
          created_at: string | null
          email: string
          guests: number | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          services: string[] | null
          wedding_date: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          created_at?: string | null
          email: string
          guests?: number | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          services?: string[] | null
          wedding_date?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          created_at?: string | null
          email?: string
          guests?: number | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          services?: string[] | null
          wedding_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_active_flash_jobs: {
        Row: {
          activa: boolean | null
          created_at: string | null
          description: string | null
          employer_id: string | null
          employer_name: string | null
          expires_at: string | null
          id: string | null
          location: string | null
          pay: string | null
          role_needed: string | null
          title: string | null
        }
        Relationships: []
      }
      admin_activity: {
        Row: {
          contacto: string | null
          cuando: string | null
          cuando_evento: string | null
          detalle: string | null
          lugar: string | null
          pendiente: boolean | null
          que_pide: string | null
          quien: string | null
          ref: string | null
          tipo: string | null
          user_id: string | null
        }
        Relationships: []
      }
      admin_client_errors: {
        Row: {
          created_at: string | null
          id: string | null
          message: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
          veces_visto_este_mensaje: number | null
        }
        Relationships: []
      }
      admin_pending_bookings: {
        Row: {
          created_at: string | null
          event_date: string | null
          event_description: string | null
          event_location: string | null
          horas_esperando: number | null
          id: string | null
          professional_name: string | null
          professional_user_id: string | null
          reminder_sent_at: string | null
          requester_contact: string | null
          requester_name: string | null
        }
        Insert: {
          created_at?: string | null
          event_date?: string | null
          event_description?: string | null
          event_location?: string | null
          horas_esperando?: never
          id?: string | null
          professional_name?: string | null
          professional_user_id?: string | null
          reminder_sent_at?: string | null
          requester_contact?: string | null
          requester_name?: string | null
        }
        Update: {
          created_at?: string | null
          event_date?: string | null
          event_description?: string | null
          event_location?: string | null
          horas_esperando?: never
          id?: string | null
          professional_name?: string | null
          professional_user_id?: string | null
          reminder_sent_at?: string | null
          requester_contact?: string | null
          requester_name?: string | null
        }
        Relationships: []
      }
      admin_perfiles_invisibles: {
        Row: {
          created_at: string | null
          display_name: string | null
          role: string | null
          sin_ciudad_real: boolean | null
          sin_foto: boolean | null
          user_id: string | null
          zone: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          role?: string | null
          sin_ciudad_real?: never
          sin_foto?: never
          user_id?: string | null
          zone?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          role?: string | null
          sin_ciudad_real?: never
          sin_foto?: never
          user_id?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      admin_salud_sistema: {
        Row: {
          asunto: string | null
          clave: string | null
          cuando: string | null
          detalle: string | null
          severidad: string | null
          tipo: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_activity_marcar_visto: { Args: never; Returns: undefined }
      admin_activity_nuevos: { Args: never; Returns: number }
      admin_borrar_actividad: {
        Args: { p_ref: string; p_tipo: string }
        Returns: boolean
      }
      admin_emails_de_usuario: {
        Args: { p_user_id: string }
        Returns: {
          html: string
          id: string
          sent_at: string
          subject: string
          type: string
        }[]
      }
      admin_resumen_conversaciones: {
        Args: never
        Returns: {
          contratado: boolean
          conversation_id: string
          participante_a: string
          participante_b: string
          total_mensajes: number
          ultimo_mensaje: string
        }[]
      }
      analytics_afiliados: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          clics: number
          desde: string
          producto: string
        }[]
      }
      analytics_blog: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          articulo: string
          desde_buscador: number
          sesiones: number
          visitas: number
        }[]
      }
      analytics_busquedas: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          sin_resultados: number
          termino: string
          veces: number
        }[]
      }
      analytics_embudo: {
        Args: { p_dias?: number }
        Returns: {
          cantidad: number
          orden: number
          paso: string
        }[]
      }
      analytics_negocio_por_dia: {
        Args: { p_dias?: number }
        Returns: {
          altas: number
          dia: string
          mensajes: number
          solicitudes: number
        }[]
      }
      analytics_online_ahora: {
        Args: never
        Returns: {
          online: number
        }[]
      }
      analytics_por_dia: {
        Args: { p_dias?: number }
        Returns: {
          dia: string
          registros: number
          sesiones: number
          visitas: number
        }[]
      }
      analytics_por_hora: {
        Args: { p_dias?: number }
        Returns: {
          hora: number
          visitas: number
        }[]
      }
      analytics_quien_online: {
        Args: never
        Returns: {
          device: string
          display_name: string
          hace_segundos: number
          rol: string
          session_id: string
          ultima_pagina: string
        }[]
      }
      analytics_recursos: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          oficio: string
          sesiones: number
          visitas: number
        }[]
      }
      analytics_top: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          tipo: string
          valor: string
          visitas: number
        }[]
      }
      analytics_usuarios_unicos: {
        Args: { p_dias?: number }
        Returns: {
          usuarios: number
        }[]
      }
      bolos_recientes_publico: {
        Args: never
        Returns: {
          event_date: string
          event_dates: string[]
          role: string
        }[]
      }
      city_ref_from_zone: { Args: { p_zone: string }; Returns: string }
      clean_stale_live_sessions: { Args: never; Returns: undefined }
      es_admin: { Args: never; Returns: boolean }
      flash_bookings_today_count: {
        Args: { p_professional_user_id: string }
        Returns: number
      }
      get_vote_count: { Args: { p_profile_id: string }; Returns: number }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      has_voted_today: {
        Args: { p_profile_id: string; p_voter_id: string }
        Returns: boolean
      }
      interesados_en_oferta: {
        Args: { p_request_id: string }
        Returns: {
          chosen_at: string
          completitud: number
          created_at: string
          foto: string
          hired_at: string
          id: string
          mensaje: string
          nombre: string
          professional_user_id: string
          slot_id: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_profile_complete: {
        Args: { p: Database["public"]["Tables"]["profiles"]["Row"] }
        Returns: boolean
      }
      latest_deletion_id: { Args: never; Returns: string }
      log_analytics_event:
        | {
            Args: {
              p_device?: string
              p_event_name: string
              p_path?: string
              p_referrer?: string
              p_session_id?: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_detalle?: string
              p_device?: string
              p_event_name: string
              p_path?: string
              p_referrer?: string
              p_session_id?: string
            }
            Returns: undefined
          }
      log_client_error: {
        Args: {
          p_component_stack?: string
          p_message: string
          p_stack?: string
          p_url?: string
          p_user_agent?: string
        }
        Returns: undefined
      }
      normalize_zone: { Args: { p_zone: string }; Returns: string }
      panel_admin_activity: {
        Args: never
        Returns: {
          contacto: string
          cuando: string
          cuando_evento: string
          detalle: string
          lugar: string
          pendiente: boolean
          que_pide: string
          quien: string
          ref: string
          tipo: string
          user_id: string
        }[]
      }
      panel_admin_client_errors: {
        Args: never
        Returns: {
          created_at: string
          id: string
          message: string
          url: string
          user_agent: string
          user_id: string
          veces_visto_este_mensaje: number
        }[]
      }
      panel_admin_contrato_chat: {
        Args: { p_user_a: string; p_user_b: string }
        Returns: {
          hablaron: boolean
          num_mensajes: number
          ultimo_mensaje: string
        }[]
      }
      panel_admin_pending_bookings: {
        Args: never
        Returns: {
          created_at: string
          event_date: string
          event_description: string
          event_location: string
          horas_esperando: number
          id: string
          professional_name: string
          professional_user_id: string
          reminder_sent_at: string
          requester_contact: string
          requester_name: string
        }[]
      }
      panel_admin_perfiles_invisibles: {
        Args: never
        Returns: {
          created_at: string
          display_name: string
          role: string
          sin_ciudad_real: boolean
          sin_foto: boolean
          user_id: string
          zone: string
        }[]
      }
      panel_admin_salud_sistema: {
        Args: never
        Returns: {
          asunto: string
          clave: string
          cuando: string
          detalle: string
          severidad: string
          tipo: string
        }[]
      }
      panel_analytics_afiliados: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          clics: number
          desde: string
          producto: string
        }[]
      }
      panel_analytics_blog: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          articulo: string
          desde_buscador: number
          sesiones: number
          visitas: number
        }[]
      }
      panel_analytics_busquedas: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          sin_resultados: number
          termino: string
          veces: number
        }[]
      }
      panel_analytics_dia: {
        Args: { p_dias?: number }
        Returns: {
          dia: string
          registros: number
          sesiones: number
          visitas: number
        }[]
      }
      panel_analytics_embudo: {
        Args: { p_dias?: number }
        Returns: {
          cantidad: number
          orden: number
          paso: string
        }[]
      }
      panel_analytics_hora: {
        Args: { p_dias?: number }
        Returns: {
          hora: number
          visitas: number
        }[]
      }
      panel_analytics_negocio: {
        Args: { p_dias?: number }
        Returns: {
          altas: number
          dia: string
          mensajes: number
          solicitudes: number
        }[]
      }
      panel_analytics_online_ahora: {
        Args: never
        Returns: {
          online: number
        }[]
      }
      panel_analytics_quien_online: {
        Args: never
        Returns: {
          device: string
          display_name: string
          hace_segundos: number
          rol: string
          session_id: string
          ultima_pagina: string
        }[]
      }
      panel_analytics_recursos: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          oficio: string
          sesiones: number
          visitas: number
        }[]
      }
      panel_analytics_top: {
        Args: { p_dias?: number; p_limite?: number }
        Returns: {
          tipo: string
          valor: string
          visitas: number
        }[]
      }
      panel_analytics_usuarios_unicos: {
        Args: { p_dias?: number }
        Returns: {
          usuarios: number
        }[]
      }
      pedir_valoraciones_bolos: { Args: never; Returns: undefined }
      perfil_campos_faltantes: {
        Args: { p_user_id: string }
        Returns: string[]
      }
      perfil_completitud: { Args: { p_user_id: string }; Returns: number }
      profile_views_last_7_days: {
        Args: { p_viewed_user_id: string }
        Returns: number
      }
      purgar_analytics_antiguos: { Args: never; Returns: undefined }
      purge_expired_deletion_claims: { Args: never; Returns: undefined }
      record_exit_survey: {
        Args: { p_comment?: string; p_deletion_id: string; p_reason: string }
        Returns: undefined
      }
      record_profile_view: {
        Args: { p_profile_user_id: string; p_viewer_id?: string }
        Returns: number
      }
      region_from_zone: { Args: { p_zone: string }; Returns: string }
      remind_pending_flash_bookings: { Args: never; Returns: undefined }
      ultima_contratacion_publica: {
        Args: never
        Returns: {
          fecha: string
          professional_user_id: string
        }[]
      }
      unaccent_immutable: { Args: { "": string }; Returns: string }
      user_profile_count: { Args: { p_user_id: string }; Returns: number }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
