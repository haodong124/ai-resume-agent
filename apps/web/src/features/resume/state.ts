// apps/web/src/features/resume/state.ts
// Fixed version with proper types

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ResumeData } from '../../types/resume'

interface ResumeState {
  resumeData: ResumeData
  selectedTemplate: string
  suggestions: string[]
  
  // Actions
  updateResumeData: (data: Partial<ResumeData>) => void
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void
  addExperience: () => void
  updateExperience: (index: number, field: keyof Experience, value: any) => void
  removeExperience: (index: number) => void
  addEducation: () => void
  updateEducation: (index: number, field: keyof Education, value: any) => void
  removeEducation: (index: number) => void
  addProject: () => void
  updateProject: (index: number, field: keyof Project, value: any) => void
  removeProject: (index: number) => void
  addSkill: (skill: string) => void
  updateSkill: (index: number, field: keyof Skill, value: any) => void
  removeSkill: (index: number) => void
  setTemplate: (template: string) => void
  addSuggestion: (suggestion: string) => void
}

const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: ''
  },
  experiences: [],
  education: [],
  skills: [],
  projects: []
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resumeData: initialResumeData,
      selectedTemplate: 'standard',
      suggestions: [],

      updateResumeData: (data: Partial<ResumeData>) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data }
        })),

      updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) =>
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
            experiences: [
              ...state.resumeData.experiences,
              {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                achievements: []
              }
            ]
          }
        })),

      updateExperience: (index: number, field: keyof Experience, value: any) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experiences: state.resumeData.experiences.map((exp, i) =>
              i === index ? { ...exp, [field]: value } : exp
            )
          }
        })),

      removeExperience: (index: number) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experiences: state.resumeData.experiences.filter((_, i) => i !== index)
          }
        })),

      addEducation: () =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: [
              ...state.resumeData.education,
              {
                school: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                gpa: '',
                achievements: []
              }
            ]
          }
        })),

      updateEducation: (index: number, field: keyof Education, value: any) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.map((edu, i) =>
              i === index ? { ...edu, [field]: value } : edu
            )
          }
        })),

      removeEducation: (index: number) =>
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
                name: '',
                description: '',
                technologies: [],
                startDate: '',
                endDate: '',
                link: '',
                achievements: []
              }
            ]
          }
        })),

      updateProject: (index: number, field: keyof Project, value: any) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.map((proj, i) =>
              i === index ? { ...proj, [field]: value } : proj
            )
          }
        })),

      removeProject: (index: number) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.filter((_, i) => i !== index)
          }
        })),

      addSkill: (skill: string) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: [...state.resumeData.skills, { name: skill, level: 'Intermediate' }]
          }
        })),

      updateSkill: (index: number, field: keyof Skill, value: any) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((skill, i) =>
              i === index ? { ...skill, [field]: value } : skill
            )
          }
        })),

      removeSkill: (index: number) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter((_, i) => i !== index)
          }
        })),

      setTemplate: (template: string) =>
        set({ selectedTemplate: template }),

      addSuggestion: (suggestion: string) =>
        set((state) => ({
          suggestions: [...state.suggestions, suggestion]
        }))
    }),
    {
      name: 'resume-storage'
    }
  )
)

// Export the ResumeData type
export type { ResumeData }
