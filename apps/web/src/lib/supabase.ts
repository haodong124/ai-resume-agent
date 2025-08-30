import { createClient } from '@supabase/supabase-js'
import { ResumeData } from '@ai-resume-agent/ui-bridge'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if Supabase is enabled
export const isSupabaseEnabled = (): boolean => {
  return supabase !== null
}

// User management
export async function findOrCreateUser(email: string) {
  if (!supabase) return null
  
  try {
    // Check if user exists
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (existingUser) return existingUser
    
    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({ email })
      .select()
      .single()
    
    if (createError) throw createError
    return newUser
  } catch (error) {
    console.error('User management error:', error)
    return null
  }
}

// Resume management
export async function saveResume(
  userId: string,
  resumeData: ResumeData,
  template: string
) {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('resumes')
      .upsert({
        user_id: userId,
        data: resumeData,
        template,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Save resume error:', error)
    return null
  }
}

export async function loadResume(userId: string) {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Load resume error:', error)
    return null
  }
}

// Export tracking
export async function checkExportPermission(resumeId: string) {
  if (!supabase) return { canExport: true, currentClicks: 0 }
  
  try {
    const { data, error } = await supabase
      .from('export_records')
      .select('share_clicks')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    
    const currentClicks = data?.share_clicks || 0
    const requiredClicks = 3
    
    return {
      canExport: currentClicks >= requiredClicks,
      currentClicks,
      requiredClicks,
    }
  } catch (error) {
    console.error('Check export permission error:', error)
    return { canExport: true, currentClicks: 0 }
  }
}

export async function createExportRecord(
  resumeId: string,
  userId: string,
  format: string
) {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('export_records')
      .insert({
        resume_id: resumeId,
        user_id: userId,
        format,
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Create export record error:', error)
    return null
  }
}

// Share link management
export async function createShareLink(resumeId: string): Promise<string | null> {
  if (!supabase) return null
  
  try {
    const shortCode = generateShortCode()
    
    const { data, error } = await supabase
      .from('share_links')
      .insert({
        resume_id: resumeId,
        short_code: shortCode,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })
      .select()
      .single()
    
    if (error) throw error
    
    return `${window.location.origin}/share/${shortCode}`
  } catch (error) {
    console.error('Create share link error:', error)
    return null
  }
}

export async function trackShareClick(shortCode: string) {
  if (!supabase) return
  
  try {
    // Update share link clicks
    await supabase.rpc('increment_share_clicks', { code: shortCode })
    
    // Get resume_id from share link
    const { data: shareLink } = await supabase
      .from('share_links')
      .select('resume_id')
      .eq('short_code', shortCode)
      .single()
    
    if (shareLink) {
      // Update export record clicks
      await supabase
        .from('export_records')
        .update({ share_clicks: supabase.raw('share_clicks + 1') })
        .eq('resume_id', shareLink.resume_id)
    }
  } catch (error) {
    console.error('Track share click error:', error)
  }
}

// Utility functions
function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Real-time subscriptions
export function subscribeToExportUpdates(
  resumeId: string,
  callback: (payload: any) => void
) {
  if (!supabase) return null
  
  return supabase
    .channel(`export_${resumeId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'export_records',
        filter: `resume_id=eq.${resumeId}`,
      },
      callback
    )
    .subscribe()
}
