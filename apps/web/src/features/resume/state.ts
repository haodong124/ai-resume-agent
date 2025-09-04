// apps/web/src/features/resume/state.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// 使用统一的类型定义
import type { 
  ResumeData, 
  PersonalInfo, 
  Experience, 
  Education, 
  Skill, 
  Project 
} from '../../types/resume'

interface ResumeState {
  resumeData: ResumeData
  selectedTemplate: string
  isEditing: boolean
  aiSuggestions: string[]
  
  // Actions
  updateResumeData: (data: Partial<ResumeData>) => void
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void
  addExperience: () => void
  updateExperience: (index: number, field: keyof Experience, value: any) => void
  removeExperience: (index: number) => void
  addEducation: () => void
  updateEducation: (index: number, field: keyof Education, value: any) => void
  removeEducation: (index: number) => void
  addProject: () => void
  updateProject: (index: number, field: keyof Project, value: any) => void
  removeProject: (index: number) => void
  addSkill: (skill: Omit<Skill, 'id'>) => void
  updateSkill: (index: number, field: keyof Skill, value: any) => void
  removeSkill: (index: number) => void
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
      
      updatePersonalInfo: (info) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalInfo: { ...state.resumeData.personalInfo, ...info }
          }
        })),
      
      addExperience: () =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: [
              ...state.resumeData.experience,
              {
                id: Date.now().toString(),
                company: '',
                position: '',
                duration: '',
                description: '',
                achievements: []
              }
            ]
          }
        })),
      
      updateExperience: (index, field, value) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.map((exp, i) =>
              i === index ? { ...exp, [field]: value } : exp
            )
          }
        })),
      
      removeExperience: (index) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.filter((_, i) => i !== index)
          }
        })),
      
      addEducation: () =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: [
              ...state.resumeData.education,
              {
                id: Date.now().toString(),
                school: '',
                degree: '',
                major: '',
                duration: '',
              }
            ]
          }
        })),
      
      updateEducation: (index, field, value) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.map((edu, i) =>
              i === index ? { ...edu, [field]: value } : edu
            )
          }
        })),
      
      removeEducation: (index) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.filter((_, i) => i !== index)
          }
        })),
      
      addProject: () =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: [
              ...state.resumeData.projects,
              {
                id: Date.now().toString(),
                name: '',
                description: '',
                technologies: [],
                duration: '',
              }
            ]
          }
        })),
      
      updateProject: (index, field, value) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.map((proj, i) =>
              i === index ? { ...proj, [field]: value } : proj
            )
          }
        })),
      
      removeProject: (index) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.filter((_, i) => i !== index)
          }
        })),
      
      addSkill: (skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: [
              ...state.resumeData.skills,
              { ...skill, id: Date.now().toString() }
            ]
          }
        })),
      
      updateSkill: (index, field, value) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((skill, i) =>
              i === index ? { ...skill, [field]: value } : skill
            )
          }
        })),
      
      removeSkill: (index) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter((_, i) => i !== index)
          }
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
