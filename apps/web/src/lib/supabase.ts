// apps/web/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// 从环境变量获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 扩展的类型定义
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  bio?: string
  linkedin_url?: string
  github_url?: string
  current_role?: string
  experience_level?: 'entry' | 'junior' | 'mid' | 'senior' | 'expert'
  skills: string[]
  interests: string[]
  subscription_tier: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  title: string
  template: string
  content: ResumeContent
  status: 'draft' | 'completed'
  is_public: boolean
  share_token?: string
  embedding?: number[]
  ai_score?: number
  last_optimized?: string
  created_at: string
  updated_at: string
}

export interface ResumeContent {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    summary?: string
    linkedin?: string
    github?: string
    website?: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate?: string
    isCurrentRole: boolean
    description: string
    achievements: string[]
    skills: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    major: string
    location: string
    startDate: string
    endDate: string
    gpa?: string
    honors?: string[]
  }>
  skills: string[]
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url?: string
    github?: string
    startDate: string
    endDate?: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    expiryDate?: string
    credentialId?: string
    url?: string
  }>
  languages: Array<{
    language: string
    proficiency: 'native' | 'fluent' | 'conversational' | 'basic'
  }>
}

export interface ChatMessage {
  id: string
  user_id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  metadata?: {
    suggestions?: string[]
    resources?: string[]
    actionItems?: string[]
    confidence?: number
  }
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  title: string
  context_type: 'career_advice' | 'resume_review' | 'interview_prep' | 'general'
  context_data?: Record<string, any>
  last_message_at: string
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
  requirements?: Record<string, any>
  job_url: string
  source: string
  skills: string[]
  job_type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  remote_type: 'on-site' | 'remote' | 'hybrid'
  experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'executive'
  embedding?: number[]
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
  resume_id?: string
  status: 'saved' | 'applied' | 'interviewing' | 'rejected' | 'offered' | 'accepted'
  match_score?: number
  match_analysis?: Record<string, any>
  notes?: string
  applied_at?: string
  interview_date?: string
  salary_expectation?: number
  created_at: string
  updated_at: string
}

export interface InterviewSession {
  id: string
  user_id: string
  job_type: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  status: 'active' | 'completed' | 'abandoned'
  questions: InterviewQuestion[]
  current_question: number
  total_score?: number
  feedback?: Record<string, any>
  created_at: string
  completed_at?: string
}

export interface InterviewQuestion {
  id: string
  content: string
  type: 'technical' | 'behavioral' | 'situational'
  expected_points: string[]
  time_limit: number
}

export interface InterviewAnswer {
  id: string
  session_id: string
  question_id: string
  answer_content: string
  audio_url?: string
  evaluation_score: number
  evaluation_feedback: string
  strengths: string[]
  improvements: string[]
  submitted_at: string
}

export interface SkillAnalysis {
  id: string
  user_id: string
  target_role: string
  current_skills: Array<{
    name: string
    level: number
    category: 'technical' | 'soft' | 'tool' | 'framework'
    market_demand: number
    trending: boolean
  }>
  skill_gaps: Array<{
    skill: string
    importance: number
    difficulty: number
    estimated_time: string
    resources: string[]
  }>
  learning_paths: Array<{
    id: string
    title: string
    description: string
    skills: string[]
    duration: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    priority: number
  }>
  analysis_date: string
  created_at: string
}

export interface JobRecommendation {
  id: string
  user_id: string
  job_id: string
  resume_id: string
  match_score: number
  match_details: {
    skill_match: number
    experience_match: number
    location_match: number
    salary_match: number
    semantic_similarity: number
  }
  reasons: string[]
  improvements: string[]
  user_feedback?: number
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

  // 获取会话
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // 重置密码
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },

  // 更新密码
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
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
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
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
          user_id: user.id,
          status: 'draft'
        })
        .select()
        .single()
      return { data, error }
    },

    // 更新简历
    update: async (id: string, updates: Partial<Resume>) => {
      const { data, error } = await supabase
        .from('resumes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
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
    },

    // 更新简历AI分数
    updateAIScore: async (id: string, score: number) => {
      const { data, error } = await supabase
        .from('resumes')
        .update({ 
          ai_score: score,
          last_optimized: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    // 更新简历向量
    updateEmbedding: async (id: string, embedding: number[]) => {
      const { data, error } = await supabase
        .from('resumes')
        .update({ embedding })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  },

  // 聊天记录操作
  chat: {
    // 创建聊天会话
    createSession: async (title: string, contextType: ChatSession['context_type'], contextData?: Record<string, any>) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title,
          context_type: contextType,
          context_data: contextData,
          last_message_at: new Date().toISOString()
        })
        .select()
        .single()
      return { data, error }
    },

    // 获取用户所有会话
    getSessions: async () => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false })
      return { data, error }
    },

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

      // 更新会话的最后消息时间
      if (data) {
        await supabase
          .from('chat_sessions')
          .update({ last_message_at: data.created_at })
          .eq('id', message.session_id)
      }
      
      return { data, error }
    },

    // 获取会话历史
    getSessionHistory: async (sessionId: string, limit: number = 50) => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(limit)
      return { data, error }
    },

    // 删除会话
    deleteSession: async (sessionId: string) => {
      // 删除会话中的所有消息
      await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)

      // 删除会话
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
      return { error }
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

    // 创建用户资料
    create: async (profile: Partial<Profile>) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          subscription_tier: 'free',
          skills: [],
          interests: [],
          ...profile
        })
        .select()
        .single()
      return { data, error }
    },

    // 更新用户资料
    update: async (updates: Partial<Profile>) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()
      return { data, error }
    },

    // 上传头像
    uploadAvatar: async (file: File) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        return { data: null, error: uploadError }
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // 更新用户资料中的头像URL
      const { data: profile, error } = await db.profiles.update({
        avatar_url: data.publicUrl
      })

      return { data: profile, error }
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
      job_type?: string
      remote_type?: string
      experience_level?: string
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
      if (filters.job_type) {
        query = query.eq('job_type', filters.job_type)
      }
      if (filters.remote_type) {
        query = query.eq('remote_type', filters.remote_type)
      }
      if (filters.experience_level) {
        query = query.eq('experience_level', filters.experience_level)
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
    
    // 获取推荐职位（基于向量搜索）
    getRecommendations: async (resumeId: string, limit: number = 10) => {
      // 这个功能需要调用 Supabase 的 RPC 函数
      const { data, error } = await supabase.rpc('get_job_recommendations', {
        resume_id: resumeId,
        match_limit: limit
      })
      return { data, error }
    },

    // 获取热门职位
    getTrending: async (limit: number = 10) => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('is_active', true)
        .order('view_count', { ascending: false })
        .limit(limit)
      return { data, error }
    },

    // 获取最新职位
    getLatest: async (limit: number = 10) => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('is_active', true)
        .order('posted_date', { ascending: false })
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
          job:job_listings(*),
          resume:resumes(id, title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      return { data, error }
    },
    
    // 保存/收藏职位
    saveJob: async (jobId: string, resumeId?: string) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('job_applications')
        .upsert({
          user_id: user.id,
          job_id: jobId,
          resume_id: resumeId,
          status: 'saved'
        })
        .select()
        .single()
      return { data, error }
    },
    
    // 更新申请状态
    updateStatus: async (jobId: string, status: JobApplication['status'], updates?: {
      notes?: string
      interview_date?: string
      salary_expectation?: number
    }) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      }
      
      if (updates?.notes) updateData.notes = updates.notes
      if (updates?.interview_date) updateData.interview_date = updates.interview_date
      if (updates?.salary_expectation) updateData.salary_expectation = updates.salary_expectation
      if (status === 'applied') updateData.applied_at = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('job_applications')
        .update(updateData)
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
    },

    // 获取申请统计
    getStats: async () => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase.rpc('get_application_stats', {
        user_id: user.id
      })
      return { data, error }
    }
  },

  // 面试相关操作
  interviews: {
    // 创建面试会话
    createSession: async (config: {
      job_type: string
      difficulty_level: InterviewSession['difficulty_level']
      questions?: InterviewQuestion[]
    }) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          job_type: config.job_type,
          difficulty_level: config.difficulty_level,
          status: 'active',
          questions: config.questions || [],
          current_question: 1
        })
        .select()
        .single()
      return { data, error }
    },

    // 获取面试会话
    getSession: async (sessionId: string) => {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()
      return { data, error }
    },

    // 更新面试进度
    updateProgress: async (sessionId: string, updates: {
      current_question?: number
      status?: InterviewSession['status']
      total_score?: number
      feedback?: Record<string, any>
    }) => {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      if (updates.status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('interview_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()
        .single()
      return { data, error }
    },

    // 保存面试答案
    saveAnswer: async (answer: Omit<InterviewAnswer, 'id'>) => {
      const { data, error } = await supabase
        .from('interview_answers')
        .insert(answer)
        .select()
        .single()
      return { data, error }
    },

    // 获取用户面试历史
    getUserSessions: async () => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    // 获取面试详细结果
    getSessionResults: async (sessionId: string) => {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          answers:interview_answers(*)
        `)
        .eq('id', sessionId)
        .single()
      return { data, error }
    }
  },

  // 技能分析
  skills: {
    // 保存技能分析结果
    saveAnalysis: async (analysis: Omit<SkillAnalysis, 'id' | 'created_at'>) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('skill_analyses')
        .insert({
          ...analysis,
          user_id: user.id
        })
        .select()
        .single()
      return { data, error }
    },

    // 获取最新技能分析
    getLatest: async () => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('skill_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      return { data, error }
    },

    // 获取技能分析历史
    getHistory: async () => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('skill_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      return { data, error }
    }
  },

  // 职位推荐
  recommendations: {
    // 保存推荐结果
    save: async (recommendations: Omit<JobRecommendation, 'id' | 'created_at'>[]) => {
      const { data, error } = await supabase
        .from('job_recommendations')
        .insert(recommendations)
        .select()
      return { data, error }
    },

    // 获取用户推荐历史
    getHistory: async (limit: number = 50) => {
      const user = await auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('job_recommendations')
        .select(`
          *,
          job:job_listings(*),
          resume:resumes(id, title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
