export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  portfolio?: string
  summary?: string
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  achievements?: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  link?: string
  achievements: string[]
}

export interface Skill {
  name: string
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category?: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]
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
  description?: string
  requirements: string[]
  benefits?: string[]
  matchScore: number
  matchedSkills?: string[]
  missingSkills?: string[]
}
