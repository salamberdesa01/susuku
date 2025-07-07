import { createClient } from '@supabase/supabase-js';

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
      collection_posts: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      farmers: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      records: {
        Row: {
          collection_post_id: string | null
          created_at: string
          evening_yield: number
          farmer_id: string
          id: string
          morning_yield: number
          production_date: string
        }
        Insert: {
          collection_post_id?: string | null
          created_at?: string
          evening_yield: number
          farmer_id: string
          id?: string
          morning_yield: number
          production_date: string
        }
        Update: {
          collection_post_id?: string | null
          created_at?: string
          evening_yield?: number
          farmer_id?: string
          id?: string
          morning_yield?: number
          production_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "records_collection_post_id_fkey"
            columns: ["collection_post_id"]
            isOneToOne: false
            referencedRelation: "collection_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          }
        ]
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


// Ganti dengan URL dan kunci anon proyek Supabase Anda
const supabaseUrl = 'https://yzqaclopxabkctyldatu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWFjbG9weGFia2N0eWxkYXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDgwODUsImV4cCI6MjA2NzQ4NDA4NX0.xYVNk1-5nqAmQzPji0xfRGCH16gpvgq6XGpFjEhWxlk';

// Inisialisasi klien Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
