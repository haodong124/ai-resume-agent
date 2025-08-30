import { Handler } from '@netlify/functions'
import { JobMatchAgent } from '@ai-resume-agent/agent-capabilities'
import { AgentCore } from '@ai-resume-agent/agent-core'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  
  try {
    const { resume, job } = JSON.parse(event.body || '{}')
    
    const agent = new AgentCore({
      llm: 'openai',
      apiKey: process.env.OPENAI_API_KEY!
    })
    
    const matcher = new JobMatchAgent(agent)
    const result = await matcher.analyzeMatch(resume, job)
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Match analysis failed' })
    }
  }
}
