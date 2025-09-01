// apps/functions/src/ai/career-chat.ts
import { Handler } from '@netlify/functions'
import { CareerAdvisor } from '@ai-resume-agent/career-advisor'
import { AgentCore } from '@ai-resume-agent/agent-core'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { message, context } = JSON.parse(event.body || '{}')
    
    if (!message || !context?.userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '缺少必要参数' })
      }
    }

    const agent = new AgentCore({
      llm: 'openai',
      apiKey: process.env.OPENAI_API_KEY!
    })
    
    const advisor = new CareerAdvisor(agent)
    const response = await advisor.chat(message, context)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: response
      })
    }
  } catch (error) {
    console.error('职业咨询API错误:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: '咨询服务暂时不可用'
      })
    }
  }
}
