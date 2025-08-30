import { Handler } from '@netlify/functions'
import { SkillRecommendAgent } from '@ai-resume-agent/agent-capabilities'
import { AgentCore } from '@ai-resume-agent/agent-core'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  
  try {
    const resumeData = JSON.parse(event.body || '{}')
    
    const agent = new AgentCore({
      llm: 'openai',
      apiKey: process.env.OPENAI_API_KEY!
    })
    
    const recommender = new SkillRecommendAgent(agent)
    const skills = await recommender.recommendSkills(
      resumeData.education,
      resumeData.experience
    )
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        recommendations: skills
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Suggestion failed' })
    }
  }
}
