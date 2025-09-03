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
  }
}
