// packages/job-recommender/src/ResumeParser.ts
import { ResumeData } from '@ai-resume-agent/ui-bridge'
import * as nlp from 'compromise'

export interface UserProfile {
  skills: string[]
  experience: {
    totalYears: number
    industries: string[]
    roles: string[]
    companies: string[]
  }
  education: {
    degrees: string[]
    majors: string[]
    schools: string[]
  }
  preferences: {
    locations: string[]
    salaryRange?: [number, number]
    jobTypes: string[]
  }
  skillVector: number[]
}

export class ResumeParser {
  private skillKeywords: Map<string, string[]>
  
  constructor() {
    // 技能关键词映射
    this.skillKeywords = new Map([
      ['frontend', ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html']],
      ['backend', ['node.js', 'python', 'java', 'spring', 'django', 'flask', 'go']],
      ['database', ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch']],
      ['cloud', ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform']],
      ['mobile', ['ios', 'android', 'swift', 'kotlin', 'react native', 'flutter']],
      ['data', ['pandas', 'numpy', 'tensorflow', 'pytorch', 'spark', 'hadoop']],
      ['design', ['figma', 'sketch', 'photoshop', 'ui/ux', 'prototyping']]
    ])
  }

  async extractProfile(resume: ResumeData): Promise<UserProfile> {
    // 1. 提取技能
    const skills = this.extractSkills(resume)
    
    // 2. 分析工作经验
    const experience = this.analyzeExperience(resume.experience || [])
    
    // 3. 提取教育背景
    const education = this.extractEducation(resume.education || [])
    
    // 4. 推断偏好
    const preferences = this.inferPreferences(resume, experience)
    
    // 5. 生成技能向量
    const skillVector = await this.generateSkillVector(skills)
    
    return {
      skills,
      experience,
      education,
      preferences,
      skillVector
    }
  }

  private extractSkills(resume: ResumeData): string[] {
    const allSkills = new Set<string>()
    
    // 从技能列表中提取
    resume.skills?.forEach(skill => {
      allSkills.add(skill.toLowerCase())
    })
    
    // 从工作经验描述中提取
    resume.experience?.forEach(exp => {
      const description = `${exp.description} ${exp.achievements?.join(' ') || ''}`
      this.extractSkillsFromText(description).forEach(skill => allSkills.add(skill))
    })
    
    // 从项目经验中提取
    resume.projects?.forEach(proj => {
      const text = `${proj.description} ${proj.technologies || ''}`
      this.extractSkillsFromText(text).forEach(skill => allSkills.add(skill))
    })
    
    return Array.from(allSkills)
  }

  private extractSkillsFromText(text: string): string[] {
    const skills: string[] = []
    const lowercaseText = text.toLowerCase()
    
    // 遍历技能关键词库
    for (const [category, keywords] of this.skillKeywords) {
      keywords.forEach(keyword => {
        if (lowercaseText.includes(keyword)) {
          skills.push(keyword)
        }
      })
    }
    
    // 使用NLP提取技术术语
    const doc = nlp(text)
    const terms = doc.match('#Technology').out('array')
    skills.push(...terms.map(term => term.toLowerCase()))
    
    return [...new Set(skills)]
  }

  private analyzeExperience(experiences: any[]) {
    let totalYears = 0
    const industries = new Set<string>()
    const roles = new Set<string>()
    const companies = new Set<string>()
    
    experiences.forEach(exp => {
      // 计算工作年限
      const startYear = new Date(exp.startDate).getFullYear()
      const endYear = exp.current ? new Date().getFullYear() : new Date(exp.endDate).getFullYear()
      totalYears += (endYear - startYear)
      
      // 提取信息
      companies.add(exp.company)
      roles.add(exp.position)
      
      // 推断行业（基于公司名称和职位）
      const industry = this.inferIndustry(exp.company, exp.position)
      if (industry) industries.add(industry)
    })
    
    return {
      totalYears,
      industries: Array.from(industries),
      roles: Array.from(roles),
      companies: Array.from(companies)
    }
  }

  private inferIndustry(company: string, position: string): string | null {
    const industryKeywords = {
      'technology': ['tech', 'software', 'developer', 'engineer', 'programming'],
      'finance': ['bank', 'financial', 'investment', 'trading', 'fintech'],
      'healthcare': ['hospital', 'medical', 'health', 'pharmaceutical', 'biotech'],
      'education': ['university', 'school', 'education', 'learning', 'academic'],
      'retail': ['retail', 'ecommerce', 'shopping', 'consumer', 'marketplace']
    }
    
    const text = `${company} ${position}`.toLowerCase()
    
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return industry
      }
    }
    
    return null
  }

  private extractEducation(education: any[]) {
    return {
      degrees: education.map(edu => edu.degree || '').filter(Boolean),
      majors: education.map(edu => edu.major || '').filter(Boolean),
      schools: education.map(edu => edu.school || '').filter(Boolean)
    }
  }

  private inferPreferences(resume: ResumeData, experience: any) {
    return {
      locations: ['Remote'], // 默认偏好
      jobTypes: ['full-time'],
      salaryRange: this.estimateSalaryRange(experience.totalYears, experience.roles)
    }
  }

  private estimateSalaryRange(years: number, roles: string[]): [number, number] {
    // 基础薪资映射
    const baseSalary = {
      'junior': [50000, 70000],
      'senior': [80000, 120000],
      'lead': [120000, 160000],
      'manager': [130000, 180000]
    }
    
    // 基于经验年限
    if (years < 2) return [50000, 70000]
    if (years < 5) return [70000, 100000]
    if (years < 8) return [100000, 130000]
    return [130000, 180000]
  }

  private async generateSkillVector(skills: string[]): Promise<number[]> {
    // 这里应该调用OpenAI Embeddings API
    // 暂时返回随机向量作为示例
    const vector = new Array(1536).fill(0).map(() => Math.random())
    return vector
  }
}

// packages/job-recommender/src/JobMatcher.ts
import { UserProfile } from './ResumeParser'

export interface JobRecommendation {
  jobId: string
  title: string
  company: string
  location: string
  matchScore: number
  reasons: MatchReason[]
  salaryRange?: [number, number]
  requiredSkills: string[]
  missingSkills: string[]
  growthPotential: number
  applicationUrl?: string
}

export interface MatchReason {
  type: 'skill_match' | 'experience_match' | 'education_match' | 'location_match'
  description: string
  weight: number
}

export class JobMatcher {
  private readonly SKILL_WEIGHT = 0.4
  private readonly EXPERIENCE_WEIGHT = 0.3
  private readonly EDUCATION_WEIGHT = 0.2
  private readonly PREFERENCE_WEIGHT = 0.1

  async calculateMatchScore(
    profile: UserProfile, 
    job: JobDescription
  ): Promise<JobRecommendation> {
    const skillScore = this.calculateSkillMatch(profile.skills, job.requiredSkills)
    const experienceScore = this.calculateExperienceMatch(profile.experience, job)
    const educationScore = this.calculateEducationMatch(profile.education, job)
    const preferenceScore = this.calculatePreferenceMatch(profile.preferences, job)

    const overallScore = Math.round(
      skillScore.score * this.SKILL_WEIGHT +
      experienceScore.score * this.EXPERIENCE_WEIGHT +
      educationScore.score * this.EDUCATION_WEIGHT +
      preferenceScore.score * this.PREFERENCE_WEIGHT
    )

    const reasons: MatchReason[] = [
      ...skillScore.reasons,
      ...experienceScore.reasons,
      ...educationScore.reasons,
      ...preferenceScore.reasons
    ]

    return {
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      matchScore: overallScore,
      reasons: reasons.sort((a, b) => b.weight - a.weight),
      salaryRange: job.salaryRange,
      requiredSkills: job.requiredSkills,
      missingSkills: this.findMissingSkills(profile.skills, job.requiredSkills),
      growthPotential: this.calculateGrowthPotential(profile, job),
      applicationUrl: job.applicationUrl
    }
  }

  private calculateSkillMatch(userSkills: string[], jobSkills: string[]) {
    const matchedSkills = userSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        this.skillsSimilar(skill, jobSkill)
      )
    )

    const score = Math.min(100, (matchedSkills.length / jobSkills.length) * 100)
    
    const reasons: MatchReason[] = matchedSkills.slice(0, 3).map(skill => ({
      type: 'skill_match',
      description: `你拥有所需技能：${skill}`,
      weight: 0.8
    }))

    return { score, reasons }
  }

  private skillsSimilar(skill1: string, skill2: string): boolean {
    // 简单的技能匹配逻辑，实际应该使用更复杂的相似度计算
    const synonyms = {
      'javascript': ['js', 'es6', 'node.js', 'nodejs'],
      'python': ['py', 'django', 'flask'],
      'react': ['reactjs', 'react.js'],
      'database': ['sql', 'mysql', 'postgresql', 'mongodb']
    }

    const s1 = skill1.toLowerCase()
    const s2 = skill2.toLowerCase()

    if (s1 === s2) return true
    if (s1.includes(s2) || s2.includes(s1)) return true

    // 检查同义词
    for (const [main, syns] of Object.entries(synonyms)) {
      if ((s1 === main || syns.includes(s1)) && 
          (s2 === main || syns.includes(s2))) {
        return true
      }
    }

    return false
  }

  private findMissingSkills(userSkills: string[], jobSkills: string[]): string[] {
    return jobSkills.filter(jobSkill => 
      !userSkills.some(userSkill => this.skillsSimilar(userSkill, jobSkill))
    )
  }

  private calculateGrowthPotential(profile: UserProfile, job: JobDescription): number {
    // 基于行业趋势、技能需求等计算成长潜力
    let potential = 50 // 基础分

    // 新兴技能加分
    const emergingSkills = ['ai', 'machine learning', 'blockchain', 'kubernetes', 'react', 'typescript']
    const hasEmergingSkills = job.requiredSkills.some(skill => 
      emergingSkills.includes(skill.toLowerCase())
    )
    if (hasEmergingSkills) potential += 20

    // 基于经验年限
    if (profile.experience.totalYears < 3) potential += 15 // 新人成长空间大
    if (profile.experience.totalYears > 10) potential -= 10 // 资深经验成长空间相对较小

    return Math.min(100, potential)
  }
}
