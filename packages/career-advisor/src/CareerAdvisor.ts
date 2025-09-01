// packages/career-advisor/src/CareerAdvisor.ts
import { AgentCore } from '@ai-resume-agent/agent-core'

export interface ConversationContext {
  userId: string
  jobTarget?: string
  currentRole?: string
  experienceLevel?: string
  industry?: string
  goals?: string[]
}

export interface AdvisorResponse {
  answer: string
  sources: string[]
  followUpQuestions: string[]
  actionItems: string[]
  confidence: number
}

export class CareerAdvisor {
  private agent: AgentCore
  private knowledgeBase: Map<string, string>
  private conversationHistory: Map<string, any[]> = new Map()

  constructor(agent: AgentCore) {
    this.agent = agent
    this.knowledgeBase = this.initializeKnowledgeBase()
  }

  private initializeKnowledgeBase(): Map<string, string> {
    const kb = new Map()
    
    // 面试准备知识
    kb.set('technical_interview', `
      技术面试准备要点：
      1. 算法和数据结构：熟练掌握常见算法，能够分析时间空间复杂度
      2. 系统设计：了解分布式系统、缓存、数据库设计原理
      3. 编程题：多练习LeetCode，掌握常见题型解法
      4. 项目经验：深入准备1-2个核心项目，能详细说明技术选型和架构
      5. 基础知识：网络、操作系统、数据库等计算机基础
    `)
    
    kb.set('behavioral_interview', `
      行为面试准备：
      1. STAR方法：用情境(Situation)、任务(Task)、行动(Action)、结果(Result)来回答
      2. 常见问题准备：团队合作、解决冲突、克服困难、领导经验等
      3. 公司研究：了解公司文化、业务、竞争对手
      4. 职业规划：明确短期和长期目标
      5. 提问准备：准备3-5个有深度的问题问面试官
    `)
    
    kb.set('salary_negotiation', `
      薪资谈判策略：
      1. 市场调研：了解行业薪资水平和公司薪酬体系
      2. 价值证明：准备具体案例证明自己的价值
      3. 谈判时机：通常在收到口头offer后进行
      4. 全面考虑：不只看基本工资，还要考虑奖金、股权、福利
      5. 专业态度：保持礼貌和专业，给出合理的期望范围
    `)
    
    kb.set('career_transition', `
      职业转型指导：
      1. 技能评估：识别可转移技能和需要学习的新技能
      2. 渐进转型：考虑相关角色作为过渡
      3. 网络建设：参加行业活动，建立新的职业网络
      4. 简历调整：突出相关经验和技能
      5. 学习计划：制定系统的学习和实践计划
    `)
    
    return kb
  }

  async chat(message: string, context: ConversationContext): Promise<AdvisorResponse> {
    // 1. 更新对话历史
    const history = this.conversationHistory.get(context.userId) || []
    history.push({ role: 'user', content: message, timestamp: new Date() })
    this.conversationHistory.set(context.userId, history)

    // 2. 检索相关知识
    const relevantKnowledge = this.retrieveRelevantKnowledge(message)

    // 3. 构建提示
    const prompt = this.buildPrompt(message, context, relevantKnowledge, history)

    // 4. 生成回答
    const response = await this.agent.process('career_advice', {
      message,
      context,
      prompt
    })

    // 5. 解析回答并提取结构化信息
    const advisorResponse = this.parseResponse(response)

    // 6. 更新对话历史
    history.push({ 
      role: 'assistant', 
      content: advisorResponse.answer, 
      timestamp: new Date() 
    })
    this.conversationHistory.set(context.userId, history)

    return advisorResponse
  }

  private retrieveRelevantKnowledge(message: string): string[] {
    const keywords = message.toLowerCase()
    const relevantKeys: string[] = []

    // 简单的关键词匹配
    if (keywords.includes('面试') || keywords.includes('interview')) {
      if (keywords.includes('技术') || keywords.includes('算法')) {
        relevantKeys.push('technical_interview')
      }
      if (keywords.includes('行为') || keywords.includes('behavioral')) {
        relevantKeys.push('behavioral_interview')
      }
    }

    if (keywords.includes('薪资') || keywords.includes('工资') || keywords.includes('salary')) {
      relevantKeys.push('salary_negotiation')
    }

    if (keywords.includes('转行') || keywords.includes('转型') || keywords.includes('transition')) {
      relevantKeys.push('career_transition')
    }

    return relevantKeys.map(key => this.knowledgeBase.get(key) || '')
  }

  private buildPrompt(
    message: string, 
    context: ConversationContext, 
    knowledge: string[], 
    history: any[]
  ): string {
    const recentHistory = history.slice(-4).map(h => 
      `${h.role}: ${h.content}`
    ).join('\n')

    return `
你是一位经验丰富的职业顾问，专门帮助求职者规划职业发展和准备面试。

用户背景信息：
- 目标职位: ${context.jobTarget || '未指定'}
- 当前角色: ${context.currentRole || '未指定'}
- 经验水平: ${context.experienceLevel || '未指定'}
- 行业: ${context.industry || '未指定'}
- 职业目标: ${context.goals?.join(', ') || '未指定'}

相关知识库：
${knowledge.join('\n\n')}

最近对话历史：
${recentHistory}

当前用户问题：${message}

请提供专业、实用的建议，包括：
1. 直接回答用户问题
2. 给出具体可行的行动建议
3. 如果适合，提供2-3个后续问题供用户思考

回答要求：
- 语言友好、专业
- 建议具体可执行
- 基于实际经验和行业最佳实践
- 如果涉及技术内容，请给出具体例子
`
  }

  private parseResponse(response: any): AdvisorResponse {
    const content = response.content || response.answer || ''
    
    // 提取行动项
    const actionItems = this.extractActionItems(content)
    
    // 生成后续问题
    const followUpQuestions = this.generateFollowUpQuestions(content)
    
    return {
      answer: content,
      sources: [], // 在实际实现中可以添加知识来源
      followUpQuestions,
      actionItems,
      confidence: 0.85 // 基于知识匹配度计算
    }
  }

  private extractActionItems(content: string): string[] {
    const actionPatterns = [
      /(\d+\.\s*[^.\n]+)/g,
      /(准备[^。\n]+)/g,
      /(学习[^。\n]+)/g,
      /(实践[^。\n]+)/g
    ]
    
    const actions: string[] = []
    
    actionPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        actions.push(...matches.slice(0, 3))
      }
    })
    
    return actions.slice(0, 5) // 最多返回5个行动项
  }

  private generateFollowUpQuestions(content: string): string[] {
    // 基于回答内容生成相关问题
    const questions = [
      '你希望我详细解释哪个方面？',
      '你在这方面有什么具体困惑吗？',
      '你想了解相关的实际案例吗？'
    ]
    
    return questions.slice(0, 2)
  }
}
