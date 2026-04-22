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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          business_name: string | null
          phone: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: 'active' | 'inactive' | 'trialing' | 'canceled' | null
          subscription_plan: 'monthly' | 'yearly' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          business_name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'trialing' | 'canceled' | null
          subscription_plan?: 'monthly' | 'yearly' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          business_name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'trialing' | 'canceled' | null
          subscription_plan?: 'monthly' | 'yearly' | null
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          last_interaction: string | null
          status: 'active' | 'inactive' | 'prospect'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          last_interaction?: string | null
          status?: 'active' | 'inactive' | 'prospect'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          email?: string | null
          phone?: string | null
          last_interaction?: string | null
          status?: 'active' | 'inactive' | 'prospect'
          notes?: string | null
          updated_at?: string
        }
      }
      devis: {
        Row: {
          id: string
          user_id: string
          client_id: string
          title: string
          amount: number | null
          status: 'pending' | 'signed' | 'refused' | 'expired'
          sent_at: string
          signed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          title: string
          amount?: number | null
          status?: 'pending' | 'signed' | 'refused' | 'expired'
          sent_at: string
          signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          amount?: number | null
          status?: 'pending' | 'signed' | 'refused' | 'expired'
          sent_at?: string
          signed_at?: string | null
          updated_at?: string
        }
      }
      relances: {
        Row: {
          id: string
          user_id: string
          client_id: string
          devis_id: string | null
          type: 'devis' | 'inactif' | 'avis'
          channel: 'email' | 'sms'
          status: 'sent' | 'responded' | 'failed'
          sent_at: string
          responded_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          devis_id?: string | null
          type: 'devis' | 'inactif' | 'avis'
          channel: 'email' | 'sms'
          status?: 'sent' | 'responded' | 'failed'
          sent_at: string
          responded_at?: string | null
          created_at?: string
        }
        Update: {
          status?: 'sent' | 'responded' | 'failed'
          responded_at?: string | null
        }
      }
      avis: {
        Row: {
          id: string
          user_id: string
          client_id: string
          requested_at: string
          responded: boolean
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          requested_at: string
          responded?: boolean
          rating?: number | null
          created_at?: string
        }
        Update: {
          responded?: boolean
          rating?: number | null
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
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Devis = Database['public']['Tables']['devis']['Row']
export type Relance = Database['public']['Tables']['relances']['Row']
export type Avis = Database['public']['Tables']['avis']['Row']
