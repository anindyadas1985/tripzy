export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          user_type: 'traveler' | 'vendor'
          preferences: Json
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          user_type?: 'traveler' | 'vendor'
          preferences?: Json
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          user_type?: 'traveler' | 'vendor'
          preferences?: Json
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          title: string
          origin: string
          destination: string
          start_date: string
          end_date: string
          status: 'planning' | 'upcoming' | 'active' | 'completed' | 'cancelled'
          style: 'leisure' | 'business' | 'family'
          pace: 'relaxed' | 'moderate' | 'packed'
          budget: number
          spent: number
          currency: string
          travelers: number
          preferences: string[]
          image: string | null
          share_code: string | null
          is_shared: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          origin: string
          destination: string
          start_date: string
          end_date: string
          status?: 'planning' | 'upcoming' | 'active' | 'completed' | 'cancelled'
          style?: 'leisure' | 'business' | 'family'
          pace?: 'relaxed' | 'moderate' | 'packed'
          budget?: number
          spent?: number
          currency?: string
          travelers?: number
          preferences?: string[]
          image?: string | null
          share_code?: string | null
          is_shared?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          origin?: string
          destination?: string
          start_date?: string
          end_date?: string
          status?: 'planning' | 'upcoming' | 'active' | 'completed' | 'cancelled'
          style?: 'leisure' | 'business' | 'family'
          pace?: 'relaxed' | 'moderate' | 'packed'
          budget?: number
          spent?: number
          currency?: string
          travelers?: number
          preferences?: string[]
          image?: string | null
          share_code?: string | null
          is_shared?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      itinerary_days: {
        Row: {
          id: string
          trip_id: string
          date: string
          day_number: number
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          date: string
          day_number: number
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          date?: string
          day_number?: number
          created_at?: string
        }
      }
      itinerary_items: {
        Row: {
          id: string
          day_id: string
          trip_id: string
          title: string
          description: string | null
          type: 'flight' | 'train' | 'bus' | 'hotel' | 'activity' | 'transport' | 'meal' | 'break'
          start_time: string
          end_time: string
          location_id: string | null
          location_name: string | null
          cost: number
          currency: string
          booking_id: string | null
          status: 'suggested' | 'booked' | 'confirmed' | 'cancelled'
          meta: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_id: string
          trip_id: string
          title: string
          description?: string | null
          type: 'flight' | 'train' | 'bus' | 'hotel' | 'activity' | 'transport' | 'meal' | 'break'
          start_time: string
          end_time: string
          location_id?: string | null
          location_name?: string | null
          cost?: number
          currency?: string
          booking_id?: string | null
          status?: 'suggested' | 'booked' | 'confirmed' | 'cancelled'
          meta?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day_id?: string
          trip_id?: string
          title?: string
          description?: string | null
          type?: 'flight' | 'train' | 'bus' | 'hotel' | 'activity' | 'transport' | 'meal' | 'break'
          start_time?: string
          end_time?: string
          location_id?: string | null
          location_name?: string | null
          cost?: number
          currency?: string
          booking_id?: string | null
          status?: 'suggested' | 'booked' | 'confirmed' | 'cancelled'
          meta?: Json
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          trip_id: string
          provider: string
          provider_booking_id: string | null
          type: 'flight' | 'train' | 'bus' | 'hotel' | 'car' | 'activity'
          title: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          price: number
          currency: string
          confirmation_code: string | null
          booking_date: string
          travel_date: string | null
          raw_payload: Json
          details: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trip_id: string
          provider: string
          provider_booking_id?: string | null
          type: 'flight' | 'train' | 'bus' | 'hotel' | 'car' | 'activity'
          title: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          price: number
          currency?: string
          confirmation_code?: string | null
          booking_date: string
          travel_date?: string | null
          raw_payload?: Json
          details?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trip_id?: string
          provider?: string
          provider_booking_id?: string | null
          type?: 'flight' | 'train' | 'bus' | 'hotel' | 'car' | 'activity'
          title?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          price?: number
          currency?: string
          confirmation_code?: string | null
          booking_date?: string
          travel_date?: string | null
          raw_payload?: Json
          details?: Json
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          lat: number
          lon: number
          address: string | null
          city: string | null
          country: string | null
          timezone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          lat: number
          lon: number
          address?: string | null
          city?: string | null
          country?: string | null
          timezone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          lat?: number
          lon?: number
          address?: string | null
          city?: string | null
          country?: string | null
          timezone?: string | null
          created_at?: string
        }
      }
      route_legs: {
        Row: {
          id: string
          from_location_id: string | null
          to_location_id: string | null
          mode: 'walking' | 'driving' | 'transit' | 'cycling' | 'flight'
          distance_m: number
          duration_s: number
          geometry: Json | null
          instructions: Json
          created_at: string
        }
        Insert: {
          id?: string
          from_location_id?: string | null
          to_location_id?: string | null
          mode: 'walking' | 'driving' | 'transit' | 'cycling' | 'flight'
          distance_m: number
          duration_s: number
          geometry?: Json | null
          instructions?: Json
          created_at?: string
        }
        Update: {
          id?: string
          from_location_id?: string | null
          to_location_id?: string | null
          mode?: 'walking' | 'driving' | 'transit' | 'cycling' | 'flight'
          distance_m?: number
          duration_s?: number
          geometry?: Json | null
          instructions?: Json
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          trip_id: string | null
          type: 'delay' | 'cancellation' | 'weather' | 'traffic' | 'recommendation' | 'gate_change' | 'price_drop' | 'booking_confirmed'
          title: string
          content: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          is_read: boolean
          action_required: boolean
          meta: Json
          sent_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          trip_id?: string | null
          type: 'delay' | 'cancellation' | 'weather' | 'traffic' | 'recommendation' | 'gate_change' | 'price_drop' | 'booking_confirmed'
          title: string
          content: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          is_read?: boolean
          action_required?: boolean
          meta?: Json
          sent_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          trip_id?: string | null
          type?: 'delay' | 'cancellation' | 'weather' | 'traffic' | 'recommendation' | 'gate_change' | 'price_drop' | 'booking_confirmed'
          title?: string
          content?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          is_read?: boolean
          action_required?: boolean
          meta?: Json
          sent_at?: string
          read_at?: string | null
        }
      }
      expense_shares: {
        Row: {
          id: string
          trip_id: string
          title: string
          description: string | null
          total_amount: number
          currency: string
          paid_by: string | null
          paid_by_name: string
          expense_date: string
          category: 'flight' | 'hotel' | 'food' | 'transport' | 'activity' | 'shopping' | 'other'
          receipt_url: string | null
          is_settled: boolean
          splits: Json
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          title: string
          description?: string | null
          total_amount: number
          currency?: string
          paid_by?: string | null
          paid_by_name: string
          expense_date: string
          category: 'flight' | 'hotel' | 'food' | 'transport' | 'activity' | 'shopping' | 'other'
          receipt_url?: string | null
          is_settled?: boolean
          splits?: Json
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          title?: string
          description?: string | null
          total_amount?: number
          currency?: string
          paid_by?: string | null
          paid_by_name?: string
          expense_date?: string
          category?: 'flight' | 'hotel' | 'food' | 'transport' | 'activity' | 'shopping' | 'other'
          receipt_url?: string | null
          is_settled?: boolean
          splits?: Json
          created_at?: string
        }
      }
      trip_members: {
        Row: {
          id: string
          trip_id: string
          user_id: string
          role: 'owner' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          user_id: string
          role?: 'owner' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          user_id?: string
          role?: 'owner' | 'member'
          joined_at?: string
        }
      }
      user_loyalty_programs: {
        Row: {
          id: string
          user_id: string
          provider: string
          membership_number: string
          tier: string | null
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          membership_number: string
          tier?: string | null
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          membership_number?: string
          tier?: string | null
          points?: number
          created_at?: string
        }
      }
      user_payment_methods: {
        Row: {
          id: string
          user_id: string
          type: 'credit' | 'debit' | 'paypal' | 'apple_pay' | 'google_pay'
          last4: string
          brand: string
          expiry_month: number
          expiry_year: number
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'credit' | 'debit' | 'paypal' | 'apple_pay' | 'google_pay'
          last4: string
          brand: string
          expiry_month: number
          expiry_year: number
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'credit' | 'debit' | 'paypal' | 'apple_pay' | 'google_pay'
          last4?: string
          brand?: string
          expiry_month?: number
          expiry_year?: number
          is_default?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}