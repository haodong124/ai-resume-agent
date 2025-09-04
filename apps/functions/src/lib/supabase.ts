// apps/functions/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 类型定义
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          profile: Record<string, any>
        }
        Insert: {
          email: string
          name?: string
          profile?: Record<string, any>
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: Record<string, any>
          embedding: number[] | null
          created_at: string
        }
        Insert: {
          user_id: string
          title?: string
          content: Record<string, any>
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          location: string | null
          salary_min: number | null
          salary_max: number | null
          description: string | null
          requirements: Record<string, any> | null
          embedding: number[] | null
          created_at: string
        }
      }
    }
  }
}
