// apps/web/src/services/apiService.ts
import type { ResumeData, JobRecommendation, JobMatchResult } from '../types/resume'

class APIService {
  private baseURL = '/.netlify/functions'

  async getJobRecommendations(resume: ResumeData, options?: {
    limit?: number
    filters?: {
      location?: string[]
      salaryMin?: number
      jobType?: string[]
      remote?: boolean
    }
  }): Promise<JobRecommendation[]> {
    try {
      const response = await fetch(`${this.baseURL}/recommend-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, options })
      })

      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || '获取推荐失败')
      }
    } catch (error) {
      console.error('Job recommendations error:', error)
      throw error
    }
  }

  async analyzeJobMatch(resume: ResumeData, jobDescription: string): Promise<JobMatchResult> {
    try {
      const response = await fetch(`${this.baseURL}/match-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, job: jobDescription })
      })

      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || '匹配分析失败')
      }
    } catch (error) {
      console.error('Job match error:', error)
      throw error
    }
  }

  async startInterview(jobType: string, difficulty: string) {
    try {
      const response = await fetch(`${this.baseURL}/interview-start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_type: jobType, difficulty_level: difficulty })
      })

      return await response.json()
    } catch (error) {
      console.error('Start interview error:', error)
      throw error
    }
  }

  async sendCareerMessage(message: string, context: any) {
    try {
      const response = await fetch(`${this.baseURL}/career-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      })

      return await response.json()
    } catch (error) {
      console.error('Career chat error:', error)
      throw error
    }
  }
}

export const apiService = new APIService()
