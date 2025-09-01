// packages/job-recommender/src/__tests__/ResumeParser.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { ResumeParser } from '../ResumeParser'
import { ResumeData } from '@ai-resume-agent/ui-bridge'

describe('ResumeParser', () => {
  let parser: ResumeParser

  beforeEach(() => {
    parser = new ResumeParser()
  })

  it('should extract skills from resume', async () => {
    const resume: ResumeData = {
      personalInfo: { name: 'Test User' },
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: [{
        company: 'Tech Corp',
        position: 'Frontend Developer',
        description: 'Used TypeScript and Vue.js for web development',
        startDate: '2020-01-01',
        endDate: '2022-01-01'
      }],
      projects: [{
        name: 'E-commerce App',
        description: 'Built with React and Express.js',
        technologies: 'React, Express.js, MongoDB'
      }]
    }

    const profile = await parser.extractProfile(resume)

    expect(profile.skills).toContain('javascript')
    expect(profile.skills).toContain('react')
    expect(profile.skills).toContain('typescript')
    expect(profile.skills).toContain('vue.js')
  })

  it('should calculate experience years correctly', async () => {
    const resume: ResumeData = {
      personalInfo: { name: 'Test User' },
      experience: [
        {
          company: 'Company A',
          position: 'Developer',
          startDate: '2018-01-01',
          endDate: '2020-01-01'
        },
        {
          company: 'Company B', 
          position: 'Senior Developer',
          startDate: '2020-01-01',
          current: true
        }
      ]
    }

    const profile = await parser.extractProfile(resume)
    const currentYear = new Date().getFullYear()
    const expectedYears = (currentYear - 2018)

    expect(profile.experience.totalYears).toBe(expectedYears)
  })

  it('should infer industry from company and position', async () => {
    const resume: ResumeData = {
      personalInfo: { name: 'Test User' },
      experience: [{
        company: 'TechCorp Software',
        position: 'Software Engineer',
        startDate: '2020-01-01',
        current: true
      }]
    }

    const profile = await parser.extractProfile(resume)

    expect(profile.experience.industries).toContain('technology')
  })
})
