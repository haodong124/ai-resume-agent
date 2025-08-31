// apps/web/src/services/aiService.ts
// 完整的AI服务集成，支持各个部分的智能优化

interface AIConfig {
  enabled: boolean
  apiKey: string
  model: string
}

// AI提示词模板
const AI_PROMPTS = {
  // 工作经历优化
  experience: {
    optimize: `作为专业的简历优化专家，请优化以下工作经历描述：
    要求：
    1. 使用STAR法则（情境-任务-行动-结果）
    2. 量化成果，使用具体数字和百分比
    3. 使用强有力的动作动词开头
    4. 突出与目标职位相关的技能和成就
    5. 每条不超过2行，简洁有力
    
    原始内容：{content}
    
    请返回优化后的内容，格式为要点列表。`,
    
    suggest: `基于以下工作经历，请提供改进建议：
    {content}
    
    请提供3-5条具体的改进建议。`,
    
    generate: `基于以下信息生成工作经历描述：
    公司：{company}
    职位：{position}
    行业：{industry}
    
    请生成3-5条工作职责和成就描述。`
  },

  // 项目经验优化
  project: {
    optimize: `请优化以下项目经验描述：
    要求：
    1. 突出技术难点和解决方案
    2. 量化项目成果和业务价值
    3. 说明个人贡献和角色
    4. 使用专业技术术语
    
    原始内容：{content}
    
    返回优化后的项目描述。`,
    
    suggest: `分析以下项目经验，提供改进建议：
    {content}
    
    请从技术深度、业务价值、个人贡献三个维度提供建议。`
  },

  // 技能优化
  skills: {
    optimize: `请优化技能列表的组织和描述：
    要求：
    1. 按类别分组（技术栈、工具、软技能等）
    2. 突出核心技能和专长
    3. 添加熟练度标识
    4. 与目标职位需求对齐
    
    当前技能：{content}
    目标职位：{targetJob}
    
    返回优化后的技能分组。`,
    
    recommend: `基于以下背景，推荐相关技能：
    工作经历：{experience}
    项目经验：{projects}
    目标职位：{targetJob}
    
    请推荐5-10个相关技能，说明推荐理由。`
  },

  // 教育背景优化
  education: {
    optimize: `优化教育背景描述：
    {content}
    
    要求：
    1. 突出与职位相关的课程和项目
    2. 强调学术成就和荣誉
    3. 添加相关的课外活动
    
    返回优化后的描述。`
  },

  // 个人简介生成
  summary: {
    generate: `基于以下信息生成专业的个人简介：
    姓名：{name}
    目标职位：{targetJob}
    工作年限：{experience}
    核心技能：{skills}
    
    要求：
    1. 3-4句话，简洁有力
    2. 突出核心竞争力
    3. 与目标职位高度相关
    4. 使用专业术语
    
    返回生成的个人简介。`
  }
}

// AI服务类
export class AIService {
  private apiKey: string
  private apiUrl: string
  private model: string
  private enabled: boolean

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey || ''
    this.apiUrl = 'https://api.openai.com/v1/chat/completions'
    this.model = config.model || 'gpt-3.5-turbo'
    this.enabled = config.enabled && !!config.apiKey
  }

  // 通用AI请求方法
  private async makeRequest(prompt: string, maxTokens: number = 500): Promise<string> {
    if (!this.enabled) {
      throw new Error('AI功能未启用或未配置API密钥')
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '你是一位专业的简历优化专家，具有丰富的人力资源经验。请用中文回复，提供专业、具体、可操作的建议。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: maxTokens
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'AI请求失败')
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('AI request error:', error)
      throw error
    }
  }

  // 优化工作经历
  async optimizeExperience(content: string): Promise<string> {
    const prompt = AI_PROMPTS.experience.optimize.replace('{content}', content)
    return this.makeRequest(prompt)
  }

  // 生成工作经历建议
  async suggestExperience(content: string): Promise<string> {
    const prompt = AI_PROMPTS.experience.suggest.replace('{content}', content)
    return this.makeRequest(prompt)
  }

  // 优化项目描述
  async optimizeProject(content: string): Promise<string> {
    const prompt = AI_PROMPTS.project.optimize.replace('{content}', content)
    return this.makeRequest(prompt)
  }

  // 优化技能列表
  async optimizeSkills(skills: string[], targetJob?: string): Promise<string> {
    let prompt = AI_PROMPTS.skills.optimize.replace('{content}', skills.join(', '))
    if (targetJob) {
      prompt = prompt.replace('{targetJob}', targetJob)
    } else {
      prompt = prompt.replace('{targetJob}', '软件工程师')
    }
    return this.makeRequest(prompt)
  }

  // 推荐技能
  async recommendSkills(
    experience: string,
    projects: string,
    targetJob: string
  ): Promise<string[]> {
    const prompt = AI_PROMPTS.skills.recommend
      .replace('{experience}', experience)
      .replace('{projects}', projects)
      .replace('{targetJob}', targetJob)
    
    const response = await this.makeRequest(prompt)
    // 解析返回的技能列表
    const skills = response.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
    
    return skills
  }

  // 生成个人简介
  async generateSummary(
    name: string,
    targetJob: string,
    experienceYears: number,
    skills: string[]
  ): Promise<string> {
    const prompt = AI_PROMPTS.summary.generate
      .replace('{name}', name)
      .replace('{targetJob}', targetJob)
      .replace('{experience}', `${experienceYears}年`)
      .replace('{skills}', skills.slice(0, 5).join('、'))
    
    return this.makeRequest(prompt, 200)
  }

  // 批量优化
  async batchOptimize(resumeData: any): Promise<any> {
    const optimized = { ...resumeData }
    
    try {
      // 优化个人简介
      if (resumeData.personalInfo?.summary) {
        optimized.personalInfo.summary = await this.generateSummary(
          resumeData.personalInfo.name,
          resumeData.personalInfo.title,
          resumeData.experience?.length || 0,
          resumeData.skills || []
        )
      }

      // 优化工作经历
      if (resumeData.experience?.length > 0) {
        optimized.experience = await Promise.all(
          resumeData.experience.map(async (exp: any) => ({
            ...exp,
            description: await this.optimizeExperience(exp.description)
          }))
        )
      }

      // 优化项目经验
      if (resumeData.projects?.length > 0) {
        optimized.projects = await Promise.all(
          resumeData.projects.map(async (project: any) => ({
            ...project,
            description: await this.optimizeProject(project.description)
          }))
        )
      }

      return optimized
    } catch (error) {
      console.error('Batch optimization error:', error)
      return resumeData
    }
  }

  // 智能分析简历完整度
  analyzeCompleteness(resumeData: any): {
    score: number
    missing: string[]
    suggestions: string[]
  } {
    const missing: string[] = []
    const suggestions: string[] = []
    let score = 100

    // 检查必填项
    if (!resumeData.personalInfo?.name) {
      missing.push('姓名')
      score -= 10
    }
    if (!resumeData.personalInfo?.email) {
      missing.push('联系邮箱')
      score -= 10
    }
    if (!resumeData.personalInfo?.phone) {
      missing.push('联系电话')
      score -= 5
    }
    if (!resumeData.personalInfo?.summary) {
      missing.push('个人简介')
      suggestions.push('添加个人简介可以让招聘者快速了解你')
      score -= 10
    }

    // 检查工作经历
    if (!resumeData.experience || resumeData.experience.length === 0) {
      missing.push('工作经历')
      score -= 20
    } else {
      resumeData.experience.forEach((exp: any, index: number) => {
        if (!exp.description || exp.description.length < 50) {
          suggestions.push(`完善第${index + 1}份工作经历的描述`)
          score -= 5
        }
      })
    }

    // 检查教育背景
    if (!resumeData.education || resumeData.education.length === 0) {
      missing.push('教育背景')
      score -= 15
    }

    // 检查技能
    if (!resumeData.skills || resumeData.skills.length < 3) {
      suggestions.push('添加更多专业技能（建议至少5个）')
      score -= 10
    }

    // 检查项目经验
    if (!resumeData.projects || resumeData.projects.length === 0) {
      suggestions.push('添加项目经验可以展示你的实践能力')
      score -= 5
    }

    return {
      score: Math.max(0, score),
      missing,
      suggestions
    }
  }
}

// 创建单例实例
let aiServiceInstance: AIService | null = null

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService({
      enabled: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      model: 'gpt-3.5-turbo'
    })
  }
  return aiServiceInstance
}

// React Hook for AI Service
import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export function useAIService() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const aiService = getAIService()

  const optimize = useCallback(async (
    type: 'experience' | 'project' | 'skills' | 'summary',
    content: any
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      let result: string
      
      switch (type) {
        case 'experience':
          result = await aiService.optimizeExperience(content)
          break
        case 'project':
          result = await aiService.optimizeProject(content)
          break
        case 'skills':
          result = await aiService.optimizeSkills(content)
          break
        case 'summary':
          result = await aiService.generateSummary(
            content.name,
            content.targetJob,
            content.experienceYears,
            content.skills
          )
          break
        default:
          throw new Error('未知的优化类型')
      }
      
      toast.success('AI优化完成！')
      return result
    } catch (err: any) {
      const errorMsg = err.message || 'AI优化失败'
      setError(errorMsg)
      toast.error(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [aiService])

  const recommendSkills = useCallback(async (
    experience: string,
    projects: string,
    targetJob: string
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const skills = await aiService.recommendSkills(experience, projects, targetJob)
      toast.success(`AI推荐了${skills.length}个相关技能`)
      return skills
    } catch (err: any) {
      const errorMsg = err.message || '技能推荐失败'
      setError(errorMsg)
      toast.error(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [aiService])

  const analyzeResume = useCallback((resumeData: any) => {
    return aiService.analyzeCompleteness(resumeData)
  }, [aiService])

  return {
    optimize,
    recommendSkills,
    analyzeResume,
    isLoading,
    error
  }
}
