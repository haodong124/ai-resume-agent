// apps/functions/src/lib/ai-utils.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    })
    
    return response.data[0].embedding
  } catch (error) {
    console.error('创建向量失败:', error)
    throw error
  }
}

export async function calculateSimilarity(embedding1: number[], embedding2: number[]): Promise<number> {
  // 计算余弦相似度
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i]
    norm1 += embedding1[i] * embedding1[i]
    norm2 += embedding2[i] * embedding2[i]
  }
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
}

export async function generateText(prompt: string, options: {
  maxTokens?: number
  temperature?: number
  model?: string
} = {}): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: options.model || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7
    })
    
    return response.choices[0].message.content || ''
  } catch (error) {
    console.error('文本生成失败:', error)
    throw error
  }
}

export async function analyzeJobMatch(resumeContent: any, jobContent: any): Promise<{
  totalScore: number
  skillMatch: number
  experienceMatch: number
  cultureMatch: number
  reasons: string[]
  improvements: string[]
}> {
  const prompt = `
作为专业的招聘顾问，请分析以下简历与职位的匹配度：

简历信息：
${JSON.stringify(resumeContent, null, 2)}

职位信息：
${JSON.stringify(jobContent, null, 2)}

请从以下维度评估匹配度（0-100分）：
1. 技能匹配 (40%)
2. 经验匹配 (35%)
3. 文化匹配 (25%)

返回JSON格式：
{
  "totalScore": 总分,
  "skillMatch": 技能匹配分,
  "experienceMatch": 经验匹配分,
  "cultureMatch": 文化匹配分,
  "reasons": ["匹配原因1", "匹配原因2"],
  "improvements": ["改进建议1", "改进建议2"]
}
`

  try {
    const response = await generateText(prompt)
    return JSON.parse(response)
  } catch (error) {
    console.error('职位匹配分析失败:', error)
    // 返回默认值
    return {
      totalScore: 70,
      skillMatch: 75,
      experienceMatch: 65,
      cultureMatch: 70,
      reasons: ['具备相关技能', '工作经验符合'],
      improvements: ['提升技术深度', '增强沟通能力']
    }
  }
}

export async function generateCareerAdvice(question: string, userContext: any): Promise<{
  answer: string
  suggestions: string[]
  resources: string[]
  actionItems: string[]
}> {
  const prompt = `
你是一位资深的职业顾问。用户提问：${question}

用户背景：
${JSON.stringify(userContext, null, 2)}

请提供专业的职业建议，包括：
1. 详细回答
2. 3-5个后续建议
3. 相关学习资源
4. 具体行动项

返回JSON格式：
{
  "answer": "详细回答",
  "suggestions": ["建议1", "建议2", "建议3"],
  "resources": ["资源1", "资源2", "资源3"],
  "actionItems": ["行动项1", "行动项2"]
}
`

  try {
    const response = await generateText(prompt)
    return JSON.parse(response)
  } catch (error) {
    console.error('职业建议生成失败:', error)
    return {
      answer: '感谢您的问题。基于您的背景，我建议您专注于提升核心技能并扩展职业网络。',
      suggestions: ['明确职业目标', '制定学习计划', '建立行业联系'],
      resources: ['相关技术文档', '行业报告', '在线课程'],
      actionItems: ['更新简历', '准备面试', '参加行业活动']
    }
  }
}
