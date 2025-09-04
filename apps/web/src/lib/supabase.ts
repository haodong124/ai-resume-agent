// apps/web/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// 从环境变量获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 类型定义
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: string
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  title: string
  template: string
  content: any
  status: 'draft' | 'completed'
  is_public: boolean
  share_token?: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  salary_min?: number
  salary_max?: number
  salary_text?: string
  description?: string
  job_url: string
  source: string
  skills: string[]
  posted_date: string
  scraped_at: string
  is_active: boolean
  view_count: number
  created_at: string
}

export interface JobApplication {
  id: string
  user_id: string
  job_id: string
  status: 'saved' | 'applied' | 'interviewing' | 'rejected' | 'offered'
  notes?: string
  applied_at?: string
  created_at: string
  updated_at: string
}

// 认证辅助函数
export const auth = {
  // 注册
  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    return { data, error }
  },

  // 登录
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // OAuth 登录
  signInWithProvider: async (provider: 'google' | 'github') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { data, error }
  },

  // 登出
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 获取当前用户
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // 重置密码
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }
}

// 数据库操作函数
export const db = {
  // 简历操作
  resumes: {
    // 获取用户所有简历
    getAll: async () => {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false })
      return { data, error }
    },

    // 获取单个简历
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    // 创建简历
    create: async (resume: Partial<Resume>) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          ...resume,
          user_id: user.id
        })
        .select()
        .single()
      return { data, error }
    },

    // 更新简历
    update: async (id: string, updates: Partial<Resume>) => {
      const { data, error } = await supabase
        .from('resumes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    // 删除简历
    delete: async (id: string) => {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
      return { error }
    },

    // 生成分享链接
    generateShareToken: async (id: string) => {
      const token = Math.random().toString(36).substring(2, 15)
      const { data, error } = await supabase
        .from('resumes')
        .update({ 
          share_token: token,
          is_public: true 
        })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    // 通过分享令牌获取简历
    getByShareToken: async (token: string) => {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('share_token', token)
        .eq('is_public', true)
        .single()
      return { data, error }
    }
  },

  // 聊天记录操作
  chat: {
    // 保存消息
    saveMessage: async (message: Omit<ChatMessage, 'id' | 'created_at'>) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          ...message,
          user_id: user.id
        })
        .select()
        .single()
      return { data, error }
    },

    // 获取会话历史
    getSessionHistory: async (sessionId: string) => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
      return { data, error }
    },

    // 获取用户所有会话
    getUserSessions: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('session_id, MAX(created_at) as last_message_at')
        .group('session_id')
        .order('last_message_at', { ascending: false })
      return { data, error }
    }
  },

  // 用户配置
  profiles: {
    // 获取用户资料
    get: async () => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      return { data, error }
    },

    // 更新用户资料
    update: async (updates: Partial<Profile>) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      return { data, error }
    }
  },

  // 职位相关操作
  jobs: {
    // 搜索职位
    search: async (filters: {
      title?: string
      location?: string
      salary_min?: number
      skills?: string[]
      page?: number
      pageSize?: number
    }) => {
      let query = supabase
        .from('job_listings')
        .select('*')
        .eq('is_active', true)
        .order('scraped_at', { ascending: false })
      
      if (filters.title) {
        query = query.ilike('title', `%${filters.title}%`)
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters.salary_min) {
        query = query.gte('salary_min', filters.salary_min)
      }
      if (filters.skills && filters.skills.length > 0) {
        query = query.contains('skills', filters.skills)
      }
      
      const page = filters.page || 0
      const pageSize = filters.pageSize || 12
      query = query.range(page * pageSize, (page + 1) * pageSize - 1)
      
      const { data, error } = await query
      return { data, error }
    },
    
    // 获取单个职位
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },
    
    // 增加查看次数
    incrementViewCount: async (id: string) => {
      const { data: job } = await supabase
        .from('job_listings')
        .select('view_count')
        .eq('id', id)
        .single()
      
      if (job) {
        const { data, error } = await supabase
          .from('job_listings')
          .update({ view_count: (job.view_count || 0) + 1 })
          .eq('id', id)
        return { data, error }
      }
      return { data: null, error: new Error('Job not found') }
    },
    
    // 获取推荐职位（基于用户简历）
    getRecommended: async (userSkills: string[], limit: number = 10) => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('is_active', true)
        .contains('skills', userSkills)
        .order('scraped_at', { ascending: false })
        .limit(limit)
      return { data, error }
    }
  },
  
  // 职位申请记录操作
  applications: {
    // 获取用户的申请记录
    getUserApplications: async () => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:job_listings(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      return { data, error }
    },
    
    // 保存/收藏职位
    saveJob: async (jobId: string) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('job_applications')
        .upsert({
          user_id: user.id,
          job_id: jobId,
          status: 'saved'
        })
        .select()
        .single()
      return { data, error }
    },
    
    // 更新申请状态
    updateStatus: async (jobId: string, status: JobApplication['status'], notes?: string) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const updates: any = { status }
      if (notes) updates.notes = notes
      if (status === 'applied') updates.applied_at = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('user_id', user.id)
        .eq('job_id', jobId)
        .select()
        .single()
      return { data, error }
    },
    
    // 删除申请记录
    removeApplication: async (jobId: string) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId)
      return { error }
    },
    
    // 获取已保存的职位ID列表
    getSavedJobIds: async () => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('job_id')
        .eq('user_id', user.id)
      
      if (data) {
        return { data: data.map(item => item.job_id), error }
      }
      return { data: [], error }
    }
  }
}
