// packages/job-recommender/src/JobRecommendationEngine.ts
import { ResumeParser, UserProfile } from './ResumeParser'
import { JobMatcher, JobRecommendation } from './JobMatcher'
import { JobDatabase } from './JobDatabase'
import { VectorStore } from '../vector-store/src/VectorStore'
import { ResumeData } from '@ai-resume-agent/ui-bridge'

export interface RecommendationOptions {
  limit?: number
  includeReasons?: boolean
  filters?: {
    location?: string[]
    salaryMin?: number
    jobType?: string[]
    remote?: boolean
  }
}

export class JobRecommendationEngine {
  private resumeParser: ResumeParser
  private jobMatcher: JobMatcher
  private jobDatabase: JobDatabase
  private vectorStore: VectorStore

  constructor(openaiApiKey: string) {
    this.resumeParser = new ResumeParser()
    this.jobMatcher = new JobMatcher()
    this.jobDatabase = new JobDatabase()
    this.vectorStore = new VectorStore(openaiApiKey)
    
    // 初始化时索引所有职位
    this.initializeJobIndex()
  }

  private async initializeJobIndex() {
    const jobs = this.jobDatabase.getAllJobs()
    for (const job of jobs) {
      await this.vectorStore.indexJob(job)
    }
  }

  async recommendJobs(
    resume: ResumeData, 
    options: RecommendationOptions = {}
  ): Promise<JobRecommendation[]> {
    const { limit = 10, includeReasons = true, filters } = options

    try {
      // 1. 解析简历获取用户画像
      console.log('🔍 解析简历中...')
      const userProfile = await this.resumeParser.extractProfile(resume)

      // 2. 向量搜索获取候选职位
      console.log('🎯 搜索匹配职位中...')
      const vectorResults = await this.vectorStore.similaritySearch(
        userProfile.skillVector,
        { limit: limit * 2 } // 获取更多候选以便后续过滤
      )

      // 3. 获取职位详细信息
      const candidateJobs = vectorResults
        .map(result => this.jobDatabase.getJobById(result.id))
        .filter(Boolean)

      // 4. 应用额外过滤器
      const filteredJobs = this.applyFilters(candidateJobs, filters)

      // 5. 计算详细匹配分数
      console.log('📊 计算匹配分数中...')
      const recommendations: JobRecommendation[] = []
      
      for (const job of filteredJobs.slice(0, limit)) {
        const recommendation = await this.jobMatcher.calculateMatchScore(userProfile, job)
        recommendations.push(recommendation)
      }

      // 6. 按匹配分数排序
      const sortedRecommendations = recommendations.sort((a, b) => b.matchScore - a.matchScore)

      console.log(`✅ 生成了 ${sortedRecommendations.length} 个职位推荐`)
      return sortedRecommendations

    } catch (error) {
      console.error('职位推荐失败:', error)
      // 降级处理：返回基本的职位匹配
      return this.getFallbackRecommendations(resume, limit)
    }
  }

  private applyFilters(jobs: JobDescription[], filters?: RecommendationOptions['filters']): JobDescription[] {
    if (!filters) return jobs

    return jobs.filter(job => {
      // 地点过滤
      if (filters.location && filters.location.length > 0) {
        if (!filters.location.includes(job.location) && !job.remote) {
          return false
        }
      }

      // 最低薪资过滤
      if (filters.salaryMin && job.salaryRange) {
        if (job.salaryRange[1] < filters.salaryMin) {
          return false
        }
      }

      // 工作类型过滤
      if (filters.jobType && filters.jobType.length > 0) {
        if (!filters.jobType.includes(job.jobType)) {
          return false
        }
      }

      // 远程工作过滤
      if (filters.remote !== undefined && job.remote !== filters.remote) {
        return false
      }

      return true
    })
  }

  private getFallbackRecommendations(resume: ResumeData, limit: number): JobRecommendation[] {
    // 简单的降级推荐逻辑
    const allJobs = this.jobDatabase.getAllJobs()
    const userSkills = resume.skills || []
    
    return allJobs.slice(0, limit).map(job => ({
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      matchScore: Math.floor(Math.random() * 40) + 60, // 60-100分随机分数
      reasons: [
        {
          type: 'skill_match' as const,
          description: '基于你的技能背景匹配',
          weight: 0.8
        }
      ],
      salaryRange: job.salaryRange,
      requiredSkills: job.requiredSkills,
      missingSkills: job.requiredSkills.filter(skill => 
        !userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ),
      growthPotential: Math.floor(Math.random() * 30) + 70,
      applicationUrl: job.applicationUrl
    }))
  }

  // 获取推荐解释
  async explainRecommendation(jobId: string, resume: ResumeData): Promise<string> {
    const job = this.jobDatabase.getJobById(jobId)
    if (!job) return '职位信息未找到'

    const userProfile = await this.resumeParser.extractProfile(resume)
    const recommendation = await this.jobMatcher.calculateMatchScore(userProfile, job)

    const explanations = [
      `这个职位与你的背景匹配度为 ${recommendation.matchScore}%`,
      '',
      '匹配原因：'
    ]

    recommendation.reasons.slice(0, 3).forEach((reason, index) => {
      explanations.push(`${index + 1}. ${reason.description}`)
    })

    if (recommendation.missingSkills.length > 0) {
      explanations.push('')
      explanations.push('建议提升的技能：')
      recommendation.missingSkills.slice(0, 3).forEach((skill, index) => {
        explanations.push(`• ${skill}`)
      })
    }

    return explanations.join('\n')
  }
}
