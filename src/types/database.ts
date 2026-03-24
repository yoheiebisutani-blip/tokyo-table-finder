export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          id: string
          name_ja: string
          name_en: string
          description_ja: string | null
          description_en: string | null
          area: string
          area_display_en: string
          area_display_ja: string
          cuisine: string
          cuisine_display_en: string
          cuisine_display_ja: string
          budget_min: number | null
          budget_max: number | null
          difficulty: number | null
          booking_method: string | null
          booking_tips_en: string | null
          english_support: boolean
          has_counter: boolean
          has_private_room: boolean
          tabelog_url: string | null
          google_maps_url: string | null
          website_url: string | null
          email: string | null
          address: string | null
          address_en: string | null
          address_ja: string | null
          phone: string | null
          image_url: string | null
          is_premium: boolean
          lunch_available: boolean
          dinner_available: boolean
          tags: string[]
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_ja: string
          name_en: string
          description_ja?: string | null
          description_en?: string | null
          area: string
          area_display_en?: string
          area_display_ja?: string
          cuisine: string
          cuisine_display_en?: string
          cuisine_display_ja?: string
          budget_min?: number | null
          budget_max?: number | null
          difficulty?: number | null
          booking_method?: string | null
          booking_tips_en?: string | null
          english_support?: boolean | null
          has_counter?: boolean | null
          has_private_room?: boolean | null
          tabelog_url?: string | null
          google_maps_url?: string | null
          website_url?: string | null
          email?: string | null
          address?: string | null
          address_en?: string | null
          address_ja?: string | null
          phone?: string | null
          image_url?: string | null
          is_premium?: boolean
          lunch_available?: boolean | null
          dinner_available?: boolean | null
          tags?: string[] | null
          rating?: number | null
        }
        Update: {
          name_ja?: string
          name_en?: string
          description_ja?: string | null
          description_en?: string | null
          area?: string
          area_display_en?: string
          area_display_ja?: string
          cuisine?: string
          cuisine_display_en?: string
          cuisine_display_ja?: string
          budget_min?: number | null
          budget_max?: number | null
          difficulty?: number | null
          booking_method?: string | null
          booking_tips_en?: string | null
          english_support?: boolean | null
          has_counter?: boolean | null
          has_private_room?: boolean | null
          tabelog_url?: string | null
          google_maps_url?: string | null
          website_url?: string | null
          email?: string | null
          address?: string | null
          address_en?: string | null
          address_ja?: string | null
          phone?: string | null
          image_url?: string | null
          is_premium?: boolean
          lunch_available?: boolean | null
          dinner_available?: boolean | null
          tags?: string[] | null
          rating?: number | null
        }
        Relationships: []
      }
      passes: {
        Row: {
          id: string
          user_id: string
          pass_type: string
          stripe_session_id: string | null
          starts_at: string
          expires_at: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pass_type: string
          stripe_session_id?: string | null
          starts_at?: string
          expires_at: string
          is_active?: boolean
        }
        Update: {
          pass_type?: string
          expires_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'passes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      generated_messages: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string | null
          restaurant_name: string
          message_ja: string
          message_en: string
          reservation_date: string | null
          reservation_time: string | null
          party_size: number | null
          special_requests: string | null
          allergies: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id?: string | null
          restaurant_name: string
          message_ja: string
          message_en: string
          reservation_date?: string | null
          reservation_time?: string | null
          party_size?: number | null
          special_requests?: string | null
          allergies?: string | null
        }
        Update: {
          restaurant_name?: string
          message_ja?: string
          message_en?: string
        }
        Relationships: [
          {
            foreignKeyName: 'generated_messages_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'generated_messages_restaurant_id_fkey'
            columns: ['restaurant_id']
            isOneToOne: false
            referencedRelation: 'restaurants'
            referencedColumns: ['id']
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'favorites_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'favorites_restaurant_id_fkey'
            columns: ['restaurant_id']
            isOneToOne: false
            referencedRelation: 'restaurants'
            referencedColumns: ['id']
          }
        ]
      }
      daily_usage: {
        Row: {
          id: string
          user_id: string
          usage_date: string
          recommend_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          usage_date?: string
          recommend_count?: number
        }
        Update: {
          recommend_count?: number
        }
        Relationships: [
          {
            foreignKeyName: 'daily_usage_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      per_use_charges: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string | null
          stripe_session_id: string | null
          is_used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id?: string | null
          stripe_session_id?: string | null
          is_used?: boolean
        }
        Update: {
          is_used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'per_use_charges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
