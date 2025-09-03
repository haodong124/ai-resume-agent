// apps/functions/ai-chat.ts
import { Handler } from '@netlify/functions'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
})

export const handler: Handler = async (event) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { message, context } = JSON.parse(event.body || '{}')

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' })
      }
    }

    // 构建系统提示
    const systemPrompt = `你是一位专业的职业发展顾问，专门帮助用户：
    1. 优化简历内容
    2. 提供职业规划建议
    3. 分析职位匹配度
    4. 准备面试技巧
    5. 提供行业洞察
    
    请用友好、专业的语气回答用户问题，提供实用的建议。如果用户询问简历相关问题，给出具体的改进建议。`

    // 调用 OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const reply = completion.choices[0]?.message?.content || '抱歉，我无法生成回复。'

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: reply,
        usage: completion.usage
      })
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'AI 服务暂时不可用'
      })
    }
  }
}
