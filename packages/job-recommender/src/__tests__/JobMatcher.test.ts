// packages/job-recommender/src/__tests__/JobMatcher.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { JobMatcher } from '../JobMatcher'
import { UserProfile } from '../ResumeParser'
import { JobDescription } from '../JobDatabase'

describe('JobMatcher', () => {
  let matcher: JobMatcher

  beforeEach(() => {
    matcher = new JobMatcher()
  })

  it('should calculate high match score for similar skills', async () => {
    const profile: UserProfile = {
      skills: ['javascript', 'react', 'node.js', 'typescript'],
      experience: {
        totalYears: 3,
        industries: ['technology'],
        roles: ['Frontend Developer'],
        companies: ['TechCorp']
      },
      education: {
        degrees: ['Bachelor'],
        majors: ['Computer Science'],
        schools: ['University']
      },
      preferences: {
        locations: ['Remote'],
        jobTypes: ['full-time']
      },
      skillVector: new Array(1536).fill(0.5)
    }

    const job: JobDescription = {
      id: '1',
      title: 'Frontend Developer',
      company: 'Google',
      description: 'Build web applications with React',
      location: 'Remote',
      requiredSkills: ['JavaScript', 'React', 'TypeScript'],
      experienceLevel: 'mid',
      jobType: 'full-time',
      remote: true,
      postedDate: new Date()
    }

    const recommendation = await matcher.calculateMatchScore(profile, job)

    expect(recommendation.matchScore).toBeGreaterThan(70)
    expect(recommendation.missingSkills).toHaveLength(0)
  })

  it('should identify missing skills', async () => {
    const profile: UserProfile = {
      skills: ['javascript', 'react'],
      experience: { totalYears: 2, industries: [], roles: [], companies: [] },
      education: { degrees: [], majors: [], schools: [] },
      preferences: { locations: [], jobTypes: [] },
      skillVector: []
    }

    const job: JobDescription = {
      id: '1',
      title: 'Full Stack Developer',
      company: 'Startup',
      description: 'Need full stack skills',
      location: 'Remote',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'Docker'],
      experienceLevel: 'mid',
      jobType: 'full-time',
      remote: true,
      postedDate: new Date()
    }

    const recommendation = await matcher.calculateMatchScore(profile, job)

    expect(recommendation.missingSkills).toContain('Python')
    expect(recommendation.missingSkills).toContain('Docker')
  })
})
