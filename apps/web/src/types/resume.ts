export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  portfolio?: string
  website?: string
  summary?: string
}

export interface Experience {
  id?: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  location?: string
  duration?: string
  description: string
  achievements: string[]
}

export interface Education {
  id?: string
  school: string
  degree: string
  field: string
  major?: string
  startDate: string
  endDate: string
  duration?: string
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
  duration?: string
  period?: string
  link?: string
  achievements: string[]
}

export interface Skill {
  id?: string
  name: string
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category?: string
  description?: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  experience?: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
}

export interface JobMatchResult {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  matched?: string[]  // 兼容性
  missing?: string[]  // 兼容性
  gaps?: string[]     // 兼容性
  suggestions?: string[]  // 兼容性
  recommendations: string[]
  analysis: {
    strengths: string[]
    improvements: string[]
    suggestions: string[]
  }
}

export interface JobRecommendation {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  salaryRange?: string
  description?: string
  requirements: string[]
  requiredSkills?: string[]
  benefits?: string[]
  matchScore: number
  matchedSkills?: string[]
  missingSkills?: string[]
  applicationUrl?: string
}
