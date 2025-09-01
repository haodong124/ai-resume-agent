// apps/functions/src/ai/explain-recommendation.ts
import { Handler } from '@netlify/functions'
import { JobRecommendationEngine } from '@ai-resume-agent/job-recommender'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { jobId, resume } = JSON.parse(event.body || '{}')
    
    const engine = new JobRecommendationEngine(process.env.OPENAI_API_KEY!)
    const explanation = await engine.explainRecommendation(jobId, resume)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        explanation
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: '解释生成失败'
      })
    }
  }
}
