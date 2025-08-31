import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 简化的类型定义
export interface PersonalInfo {
  name?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
}

export interface Experience {
  id?: string
  company: string
  position: string
  startDate: string
  endDate: string
  current?: boolean
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
}

export interface Skill {
  id?: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: 'technical' | 'soft' | 'language' | 'tool'
}

export interface Project {
  id?: string
  name: string
  description: string
  technologies: string
  period: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certificates: any[]
  achievements: any[]
  languages: any[]
}

interface ResumeState {
  resumeData: ResumeData
  selectedTemplate: string
  isEditing: boolean
  aiSuggestions: string[]
  
  // Actions
  updateResumeData: (data: Partial<ResumeData>) => void
  setTemplate: (template: string) => void
  addAISuggestion: (suggestion: string) => void
  clearSuggestions: () => void
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resumeData: {
        personalInfo: {
          name: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certificates: [],
        achievements: [],
        languages: [],
      },
      selectedTemplate: 'standard',
      isEditing: false,
      aiSuggestions: [],
      
      updateResumeData: (data) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),
        
      setTemplate: (template) =>
        set({ selectedTemplate: template }),
        
      addAISuggestion: (suggestion) =>
        set((state) => ({
          aiSuggestions: [...state.aiSuggestions, suggestion],
        })),
        
      clearSuggestions: () => set({ aiSuggestions: [] }),
    }),
    {
      name: 'resume-storage',
    }
  )
)
