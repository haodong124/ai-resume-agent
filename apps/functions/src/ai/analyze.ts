import { Handler } from '@netlify/functions'
import { ResumeContentOptimizer } from '@ai-resume-agent/agent-capabilities'
import { AgentCore } from '@ai-resume-agent/agent-core'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  
  try {
    const { resume } = JSON.parse(event.body || '{}')
    
    const agent = new AgentCore({
      llm: 'openai',
      apiKey: process.env.OPENAI_API_KEY!
    })
    
    const optimizer = new ResumeContentOptimizer(agent)
    
    // Analyze each section
    const results = {
      experience: [],
      projects: [],
      skills: []
    }
    
    // Optimize experiences
    for (const exp of resume.experience) {
      const optimized = await optimizer.optimizeContent(
        exp.description,
        'experience'
      )
      results.experience.push(optimized)
    }
    
    // Optimize projects
    for (const proj of resume.projects) {
      const optimized = await optimizer.optimizeContent(
        proj.description,
        'project'
      )
      results.projects.push(optimized)
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        results
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Analysis failed' })
    }
  }
}
