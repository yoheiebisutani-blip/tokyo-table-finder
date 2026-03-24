import type { Database } from './database'

// Table row types
export type Restaurant = Database['public']['Tables']['restaurants']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Pass = Database['public']['Tables']['passes']['Row']
export type GeneratedMessage = Database['public']['Tables']['generated_messages']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type DailyUsage = Database['public']['Tables']['daily_usage']['Row']
export type PerUseCharge = Database['public']['Tables']['per_use_charges']['Row']

// API Request types
export interface GenerateMessageRequest {
  restaurant_id: string
  restaurant_name_ja: string
  date: string
  time: string
  party_size: number
  special_requests?: string
  allergies?: string
}

export interface RecommendRequest {
  area?: string
  cuisine?: string
  budget_max?: number
  preferences?: string
}

export interface CheckoutRequest {
  pass_type: '7day' | '14day' | '30day' | 'single'
  restaurant_id?: string
}

// API Response types
export interface GenerateMessageResponse {
  id: string
  message_ja: string
  message_en: string
  restaurant_name: string
}

export interface RecommendResponse {
  recommendations: {
    restaurant: Restaurant
    reason: string
  }[]
}

export interface PassStatusResponse {
  has_active_pass: boolean
  pass_type: string | null
  expires_at: string | null
  days_remaining: number | null
}

export interface CheckoutResponse {
  url: string
}

export interface ApiError {
  error: string
  message: string
}
