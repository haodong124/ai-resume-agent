// packages/ui-bridge/src/types.ts - 类型定义文件
// 文件路径: packages/ui-bridge/src/types.ts

export interface PersonalInfo {
  name?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  website?: string
  linkedin?: string
  github?: string
}

export interface Experience {
  id?: string
  company: string
  position: string
  startDate: string
  endDate: string
  current?: boolean
  location?: string
  description: string
}

export interface Education {
  id?: string
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa?: string
  honors?: string
}

export interface Skill {
  id?: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: 'technical' | 'soft' | 'language' | 'tool'
  yearsOfExperience?: number
}

export interface Project {
  id?: string
  name: string
  description: string
  technologies: string
  period: string
  url?: string
  github?: string
}

export interface Certificate {
  id?: string
  name: string
  issuer: string
  date: string
  url?: string
  expiryDate?: string
}

export interface Achievement {
  id?: string
  title: string
  description: string
  date: string
  category?: string
}

export interface Language {
  id?: string
  name: string
  level: 'basic' | 'conversational' | 'fluent' | 'native'
  certification?: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certificates: Certificate[]
  achievements: Achievement[]
  languages: Language[]
}

export interface AIAnalysisResult {
  score: number
  suggestions: string[]
  optimizedContent?: string
  improvements: string[]
}

export interface JobMatchResult {
  score: number
  matched: string[]
  missing: string[]
  gaps: Array<{
    category: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
  suggestions: string[]
}
