// ===== 1. apps/web/src/types/resume.ts =====
// 完整的类型定义文件

export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  portfolio?: string
  website?: string  // 添加website字段
  summary?: string
}

export interface Experience {
  id?: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  location?: string  // 添加location字段
  duration?: string  // 添加duration字段
  description: string
  achievements: string[]
}

export interface Education {
  id?: string
  school: string
  degree: string
  field: string
  major?: string  // 添加major字段
  startDate: string
  endDate: string
  duration?: string  // 添加duration字段
  gpa?: string
  achievements?: string[]
}

export interface Project {
  id?: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  duration?: string  // 添加duration字段
  link?: string
  achievements: string[]
}

export interface Skill {
  id?: string
  name: string
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category?: string
  description?: string  // 添加description字段
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]  // 确保是复数
  experience?: Experience[]  // 添加兼容性字段
  education: Education[]
  skills: Skill[]
  projects: Project[]
}

export interface JobRecommendation {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  salaryRange?: string  // 添加salaryRange
  description?: string
  requirements: string[]
  requiredSkills?: string[]  // 添加requiredSkills
  benefits?: string[]
  matchScore: number
  matchedSkills?: string[]
  missingSkills?: string[]
  applicationUrl?: string  // 添加applicationUrl
}

export interface JobMatchResult {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  recommendations: string[]
  analysis: {
    strengths: string[]
    improvements: string[]
    suggestions: string[]
  }
}
