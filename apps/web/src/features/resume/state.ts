import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ResumeData } from '@ai-resume-agent/ui-bridge'

interface ResumeState {
  resumeData: ResumeData
  selectedTemplate: string
  isEditing: boolean
  aiSuggestions: string[]
  exportHistory: Array<{
    id: string
    date: Date
    format: 'pdf' | 'png' | 'docx'
  }>
  
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
        },
        education: [],
        experience: [],
        projects: [],
        skills: [],
        certificates: [],
        achievements: [],
        languages: [],
      },
      selectedTemplate: 'standard',
      isEditing: false,
      aiSuggestions: [],
      exportHistory: [],
      
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
