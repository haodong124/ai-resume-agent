// packages/job-recommender/src/JobDatabase.ts
export interface JobDescription {
  id: string
  title: string
  company: string
  description: string
  location: string
  requiredSkills: string[]
  preferredSkills?: string[]
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
  salaryRange?: [number, number]
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship'
  remote: boolean
  benefits?: string[]
  applicationUrl?: string
  postedDate: Date
}

export class JobDatabase {
  private jobs: Map<string, JobDescription> = new Map()

  constructor() {
    // 初始化示例数据
    this.initializeSampleJobs()
  }

  private initializeSampleJobs() {
    const sampleJobs: JobDescription[] = [
      {
        id: '1',
        title: '前端开发工程师',
        company: '字节跳动',
        description: '负责前端应用开发，使用React/Vue等现代框架，与后端团队协作完成产品功能',
        location: '北京',
        requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript'],
        preferredSkills: ['Next.js', 'Tailwind CSS', 'GraphQL'],
        experienceLevel: 'mid',
        salaryRange: [25000, 40000],
        jobType: 'full-time',
        remote: true,
        benefits: ['五险一金', '带薪年假', '弹性工作', '股票期权'],
        postedDate: new Date('2024-12-01')
      },
      {
        id: '2',
        title: 'Python后端开发工程师',
        company: '腾讯',
        description: '开发高并发后端服务，负责API设计和数据库优化',
        location: '深圳',
        requiredSkills: ['Python', 'Django', 'MySQL', 'Redis', 'Docker'],
        preferredSkills: ['Kubernetes', 'AWS', 'MongoDB'],
        experienceLevel: 'senior',
        salaryRange: [30000, 50000],
        jobType: 'full-time',
        remote: false,
        benefits: ['高额年终奖', '医疗保险', '健身房'],
        postedDate: new Date('2024-11-28')
      },
      {
        id: '3',
        title: '全栈工程师',
        company: '阿里巴巴',
        description: '负责全栈开发，从前端到后端到部署的完整技术栈',
        location: '杭州',
        requiredSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB'],
        experienceLevel: 'mid',
        salaryRange: [28000, 45000],
        jobType: 'full-time',
        remote: true,
        postedDate: new Date('2024-11-25')
      }
    ]

    sampleJobs.forEach(job => this.jobs.set(job.id, job))
  }

  getAllJobs(): JobDescription[] {
    return Array.from(this.jobs.values())
  }

  getJobById(id: string): JobDescription | undefined {
    return this.jobs.get(id)
  }

  searchJobs(filters: {
    keywords?: string[]
    location?: string
    experienceLevel?: string
    salaryMin?: number
    remote?: boolean
  }): JobDescription[] {
    return Array.from(this.jobs.values()).filter(job => {
      // 关键词匹配
      if (filters.keywords && filters.keywords.length > 0) {
        const jobText = `${job.title} ${job.description} ${job.requiredSkills.join(' ')}`.toLowerCase()
        const hasKeywords = filters.keywords.some(keyword => 
          jobText.includes(keyword.toLowerCase())
        )
        if (!hasKeywords) return false
      }

      // 地点匹配
      if (filters.location && job.location !== filters.location && !job.remote) {
        return false
      }

      // 经验水平匹配
      if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) {
        return false
      }

      // 薪资匹配
      if (filters.salaryMin && job.salaryRange) {
        if (job.salaryRange[1] < filters.salaryMin) return false
      }

      // 远程工作匹配
      if (filters.remote !== undefined && job.remote !== filters.remote) {
        return false
      }

      return true
    })
  }

  addJob(job: JobDescription): void {
    this.jobs.set(job.id, job)
  }
}
