// packages/ui-bridge/src/validation.ts
import { z } from 'zod'
import { ResumeData } from './types'

const PersonalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  location: z.string().min(1, 'Location is required'),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
})

const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string(),
  achievements: z.array(z.string()),
})

const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  gpa: z.number().min(0).max(4.0).optional(),
})

const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  category: z.string(),
})

const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  technologies: z.array(z.string()),
  url: z.string().url().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
})

const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string(),
  expires: z.string().optional(),
  url: z.string().url().optional(),
})

const LanguageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  proficiency: z.enum(['basic', 'conversational', 'professional', 'native']),
})

export const ResumeDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillSchema),
  projects: z.array(ProjectSchema),
  certifications: z.array(CertificationSchema),
  languages: z.array(LanguageSchema),
  summary: z.string().optional(),
})

export function validateResumeData(data: unknown): ResumeData {
  const result = ResumeDataSchema.safeParse(data)
  if (result.success) {
    return result.data as ResumeData
  } else {
    throw new ValidationError(result.error)
  }
}

export class ValidationError extends Error {
  constructor(public errors: z.ZodError) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}

// Type assertion helper to ensure compatibility
export function assertResumeData(data: any): ResumeData {
  return data as ResumeData
}
