// apps/web/src/types/resume.ts
export interface PersonalInfo {
  name?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  website?: string
  linkedin?: string
  github?: string
  title?: string
}

export interface Experience {
  id?: string
  company: string
  position: string
  duration: string
  location?: string
  description: string
  achievements?: string[]
  current?: boolean
}

export interface Education {
  id?: string
  school: string
  degree: string
  major: string
  duration: string
  location?: string
  gpa?: string
  honors?: string[]
}

export interface Skill {
  id?: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
  description?: string
  yearsOfExperience?: number
}

export interface Project {
  id?: string
  name: string
  description: string
  technologies: string[]
  duration: string
  role?: string
  link?: string
  github?: string
  achievements?: string[]
}

export interface Certificate {
  id?: string
  name: string
  issuer: string
  date: string
  link?: string
  expiryDate?: string
}

export interface Achievement {
  id?: string
  title: string
  description: string
  date: string
  category?: string
  type?: 'education' | 'work' | 'project' | 'other'
}

export interface Language {
  id?: string
  name: string
  level: 'basic' | 'conversational' | 'professional' | 'native'
  description?: string
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
  skillsSummary?: string
}

// AI 相关类型
export interface JobRecommendation {
  jobId: string
  title: string
  company: string
  location: string
  matchScore: number
  salaryRange?: [number, number]
  requiredSkills: string[]
  missingSkills: string[]
  reasons: Array<{
    type: 'skill_match' | 'experience_match' | 'education_match'
    description: string
    weight: number
  }>
  growthPotential: number
  applicationUrl?: string
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

export interface ConversationContext {
  userId: string
  jobTarget?: string
  currentRole?: string
  experienceLevel?: string
  industry?: string
  goals?: string[]
}
