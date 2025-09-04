// ===== 3. apps/web/src/features/resume/state.ts =====
// 修复后的状态管理文件

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeData, PersonalInfo, Experience, Education, Project, Skill } from '../../types/resume'

interface ResumeState {
  resumeData: ResumeData
  selectedTemplate: string
  suggestions: string[]
  
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
  addSkill: (skill: string) => void
  updateSkill: (index: number, field: keyof Skill, value: any) => void
  removeSkill: (index: number) => void
  setTemplate: (template: string) => void
  addSuggestion: (suggestion: string) => void
}

const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    title: '',  // 添加title字段
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    website: '',
    summary: ''
  },
  experiences: [],
  experience: [],  // 添加兼容性字段
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

      updateResumeData: (data) =>
        set((state) => ({
          resumeData: { 
            ...state.resumeData, 
            ...data,
            // 同步experience和experiences字段
            experience: data.experiences || state.resumeData.experiences,
            experiences: data.experience || data.experiences || state.resumeData.experiences
          }
        })),

      updatePersonalInfo: (info) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalInfo: { ...state.resumeData.personalInfo, ...info }
          }
        })),

      addExperience: () =>
        set((state) => {
          const newExperience = {
            id: Date.now().toString(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            location: '',
            duration: '',
            description: '',
            achievements: []
          }
          return {
            resumeData: {
              ...state.resumeData,
              experiences: [...state.resumeData.experiences, newExperience],
              experience: [...state.resumeData.experiences, newExperience]
            }
          }
        }),

      updateExperience: (index, field, value) =>
        set((state) => {
          const updatedExperiences = state.resumeData.experiences.map((exp, i) =>
            i === index ? { ...exp, [field]: value } : exp
          )
          return {
            resumeData: {
              ...state.resumeData,
              experiences: updatedExperiences,
              experience: updatedExperiences
            }
          }
        }),

      removeExperience: (index) =>
        set((state) => {
          const filteredExperiences = state.resumeData.experiences.filter((_, i) => i !== index)
          return {
            resumeData: {
              ...state.resumeData,
              experiences: filteredExperiences,
              experience: filteredExperiences
            }
          }
        }),

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
                field: '',
                major: '',
                startDate: '',
                endDate: '',
                duration: '',
                gpa: '',
                achievements: []
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
                startDate: '',
                endDate: '',
                duration: '',
                link: '',
                achievements: []
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
              { 
                id: Date.now().toString(),
                name: skill, 
                level: 'Intermediate',
                category: 'general'
              }
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

      addSuggestion: (suggestion) =>
        set((state) => ({
          suggestions: [...state.suggestions, suggestion]
        }))
    }),
    {
      name: 'resume-storage'
    }
  )
)

// 导出ResumeData类型
export type { ResumeData }
