// packages/ui-bridge/src/types.ts
export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  summary?: string
}

export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  website?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: number
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate: string
  endDate?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expires?: string
  url?: string
}

export interface Language {
  id: string
  name: string
  proficiency: 'basic' | 'conversational' | 'professional' | 'native'
}
