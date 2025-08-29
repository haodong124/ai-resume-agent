import { Handler } from '@netlify/functions'
import { AgentCore } from '@ai-resume-agent/agent-core'
import { ResumeContentOptimizer } from '@ai-resume-agent/agent-capabilities'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  
  try {
    const resumeData = JSON.parse(event.body || '{}')
    
    // 初始化Agent
    const agent = new AgentCore({
      llm: process.env.OPENAI_API_KEY ? 'openai' : 'mock',
      apiKey: process.env.OPENAI_API_KEY,
    })
    
    // 使用简历优化能力
    const optimizer = new ResumeContentOptimizer(agent)
    const analysis = await optimizer.analyze(resumeData)
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        analysis,
        suggestions: analysis.improvements,
        score: analysis.overallScore,
      }),
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '分析失败' }),
    }
  }
}
