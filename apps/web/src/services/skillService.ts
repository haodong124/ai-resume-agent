// apps/web/src/services/skillService.ts
import type { Skill, ResumeData } from '../types/resume'

interface SkillSuggestion {
  name: string
  category: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  marketDemand: number
  learningDifficulty: number
}

export class SkillService {
  private static instance: SkillService

  static getInstance(): SkillService {
    if (!SkillService.instance) {
      SkillService.instance = new SkillService()
    }
    return SkillService.instance
  }

  async getSkillSuggestions(resumeData: ResumeData, targetRole?: string): Promise<SkillSuggestion[]> {
    try {
      const response = await fetch('/.netlify/functions/skill-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resume: resumeData,
          targetRole: targetRole || resumeData.personalInfo.title
        })
      })

      const result = await response.json()
      
      if (result.success) {
        return result.data.suggestions || []
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Skill recommendations error:', error)
      
      // 返回模拟数据
      return this.getMockSkillSuggestions(resumeData, targetRole)
    }
  }

  private getMockSkillSuggestions(resumeData: ResumeData, targetRole?: string): SkillSuggestion[] {
    const role = targetRole || resumeData.personalInfo.title || ''
    const currentSkills = resumeData.skills.map(s => s.name.toLowerCase())

    const allSuggestions: SkillSuggestion[] = [
      // 前端技能
      { name: 'TypeScript', category: '编程语言', reason: '现代前端开发必备', priority: 'high', marketDemand: 95, learningDifficulty: 6 },
      { name: 'Vue.js', category: '前端框架', reason: '热门前端框架之一', priority: 'medium', marketDemand: 85, learningDifficulty: 7 },
      { name: 'Next.js', category: '前端框架', reason: 'React生态系统重要工具', priority: 'high', marketDemand: 90, learningDifficulty: 8 },
      { name: 'Tailwind CSS', category: '前端工具', reason: '提高开发效率的CSS框架', priority: 'medium', marketDemand: 80, learningDifficulty: 4 },
      
      // 后端技能
      { name: 'Node.js', category: '后端技术', reason: 'JavaScript全栈开发', priority: 'high', marketDemand: 90, learningDifficulty: 7 },
      { name: 'Python', category: '编程语言', reason: '数据分析和后端开发', priority: 'high', marketDemand: 95, learningDifficulty: 6 },
      { name: 'Docker', category: '开发工具', reason: '容器化部署必备技能', priority: 'high', marketDemand: 85, learningDifficulty: 8 },
      
      // 软技能
      { name: '项目管理', category: '软技能', reason: '团队协作必备能力', priority: 'medium', marketDemand: 75, learningDifficulty: 5 },
      { name: '产品思维', category: '软技能', reason: '理解业务需求', priority: 'medium', marketDemand: 70, learningDifficulty: 6 },
      
      // 新兴技能
      { name: 'AI/机器学习', category: '新兴技能', reason: '未来技术趋势', priority: 'high', marketDemand: 88, learningDifficulty: 9 },
      { name: '数据可视化', category: '数据技能', reason: '数据驱动决策', priority: 'medium', marketDemand: 75, learningDifficulty: 6 }
    ]

    // 过滤掉已有技能
    const filtered = allSuggestions.filter(suggestion => 
      !currentSkills.includes(suggestion.name.toLowerCase())
    )

    // 根据目标职位调整优先级
    if (role.toLowerCase().includes('前端') || role.toLowerCase().includes('frontend')) {
      return filtered.filter(s => 
        s.category.includes('前端') || 
        s.category.includes('编程语言') || 
        s.name === 'TypeScript'
      ).slice(0, 8)
    }

    return filtered.slice(0, 8)
  }

  async getSkillLearningPath(skillName: string): Promise<{
    timeEstimate: string
    resources: Array<{ type: string, title: string, url: string }>
    milestones: string[]
  }> {
    // 模拟学习路径数据
    const learningPaths: Record<string, any> = {
      'TypeScript': {
        timeEstimate: '4-6周',
        resources: [
          { type: '官方文档', title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' },
          { type: '在线课程', title: 'TypeScript入门课程', url: '#' }
        ],
        milestones: [
          '了解基本类型系统',
          '掌握接口和类型别名',
          '学会泛型的使用',
          '实践项目开发'
        ]
      }
    }

    return learningPaths[skillName] || {
      timeEstimate: '待评估',
      resources: [],
      milestones: []
    }
  }
}

export const skillService = SkillService.getInstance()
