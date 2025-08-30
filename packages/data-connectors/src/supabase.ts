import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class SupabaseConnector {
  private client: SupabaseClient | null = null
  
  constructor(url?: string, key?: string) {
    if (url && key) {
      this.client = createClient(url, key)
    }
  }
  
  isEnabled(): boolean {
    return this.client !== null
  }
  
  async findOrCreateUser(email: string) {
    if (!this.client) return null
    
    try {
      const { data: existing } = await this.client
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (existing) return existing
      
      const { data: newUser } = await this.client
        .from('users')
        .insert({ email })
        .select()
        .single()
      
      return newUser
    } catch (error) {
      console.error('User management error:', error)
      return null
    }
  }
  
  async saveResume(userId: string, data: any, template: string) {
    if (!this.client) return null
    
    try {
      const { data: resume } = await this.client
        .from('resumes')
        .upsert({
          user_id: userId,
          data,
          template,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      return resume
    } catch (error) {
      console.error('Save resume error:', error)
      return null
    }
  }
}
