// packages/career-advisor/src/CareerChatAgent.ts
import { ChatOpenAI } from "@langchain/openai"
import { ConversationSummaryBufferMemory } from "langchain/memory"
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages"

export class CareerChatAgent {
  private llm: ChatOpenAI
  private memory: ConversationSummaryBufferMemory
  private knowledgeBase: Map<string, string>

  constructor(apiKey: string) {
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7,
      maxTokens: 1000
    })

    this.memory = new ConversationSummaryBufferMemory({
      llm: this.llm,
      maxTokenLimit: 2000,
      returnMessages: true
    })

    this.initializeKnowledgeBase()
  }

  private initializeKnowledgeBase() {
    this.knowledgeBase = new Map([
      ['interview_prep', `
        技术面试准备关键点：
        1. 算法和数据结构：掌握常见算法，练习LeetCode
        2. 系统设计：了解分布式系统、缓存、数据库设计
        3. 编程实现：准备手写代码，注意代码质量
        4. 项目经验：准备2-3个核心项目的详细介绍
        5. 基础知识：网络、操作系统、数据库等
      `],
      ['salary_negotiation', `
        薪资谈判策略：
        1. 市场调研：了解行业薪资水平
        2. 时机把握：获得offer后再谈薪资
        3. 整体考虑：基本工资+奖金+股权+福利
        4. 专业态度：礼貌坚定，给出合理范围
        5. 备选方案：准备其他谈判要点（假期、培训等）
      `],
      ['career_change', `
        职业转型建议：
        1. 技能评估：识别可转移技能和技能缺口
        2. 学习计划：制定系统的技能提升计划
        3. 网络建设：参加行业活动，建立关系
        4. 渐进转型：考虑相关岗位作为跳板
        5. 简历调整：突出相关经验和潜力
      `]
    ])
  }

  async chat(message: string, userContext?: any): Promise<{
    response: string
    suggestions: string[]
    resources: string[]
  }> {
    // 1. 获取对话历史
    const chatHistory = await this.memory.chatHistory.getMessages()

    // 2. 检索相关知识
    const relevantKnowledge = this.retrieveKnowledge(message)

    // 3. 构建系统提示
    const systemPrompt = `
你是一位资深的职业顾问，具有10年以上的HR和职业规划经验。

用户背景：${JSON.stringify(userContext || {})}

相关知识：
${relevantKnowledge}

回答要求：
1. 专业、实用、可执行
2. 结合用户具体情况
3. 提供3-5个后续建议
4. 推荐相关学习资源
5. 保持友好、鼓励的语调

请用JSON格式回答：
{
  "response": "详细回答",
  "suggestions": ["建议1", "建议2", "建议3"],
  "resources": ["资源1", "资源2", "资源3"]
}
    `

    // 4. 构建消息链
    const messages = [
      new SystemMessage(systemPrompt),
      ...chatHistory,
      new HumanMessage(message)
    ]

    // 5. 生成回答
    const response = await this.llm.invoke(messages)

    // 6. 更新记忆
    await this.memory.saveContext(
      { input: message },
      { output: response.content as string }
    )

    // 7. 解析结构化回答
    try {
      return JSON.parse(response.content as string)
    } catch (error) {
      // 如果解析失败，返回原始回答
      return {
        response: response.content as string,
        suggestions: [],
        resources: []
      }
    }
  }

  private retrieveKnowledge(query: string): string {
    const queryLower = query.toLowerCase()
    let relevantKnowledge = ''

    for (const [key, knowledge] of this.knowledgeBase) {
      if (queryLower.includes(key.replace('_', ' ')) || 
          queryLower.includes('面试') && key === 'interview_prep' ||
          queryLower.includes('薪资') && key === 'salary_negotiation' ||
          queryLower.includes('转行') && key === 'career_change') {
        relevantKnowledge += knowledge + '\n\n'
      }
    }

    return relevantKnowledge
  }

  async getUserInsights(userId: string): Promise<any> {
    // 从数据库获取用户的历史对话和简历数据，生成个性化洞察
    const { data: conversations } = await supabase
      .from('career_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    // 分析用户关注点和发展轨迹
    const topics = this.extractTopics(conversations)
    const careerStage = this.assessCareerStage(conversations)

    return {
      topics,
      careerStage,
      recommendations: this.generatePersonalizedRecommendations(topics, careerStage)
    }
  }

  private extractTopics(conversations: any[]): string[] {
    // 简单的关键词提取，生产环境可以用更复杂的NLP
    const topicKeywords = new Map([
      ['interview', '面试'],
      ['salary', '薪资'],
      ['career_change', '转行'],
      ['skill_development', '技能'],
      ['leadership', '管理']
    ])

    const topicCounts = new Map()
    conversations.forEach(conv => {
      const content = conv.message.toLowerCase()
      topicKeywords.forEach((chinese, english) => {
        if (content.includes(english) || content.includes(chinese)) {
          topicCounts.set(english, (topicCounts.get(english) || 0) + 1)
        }
      })
    })

    return Array.from(topicCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic)
  }
}

    for
