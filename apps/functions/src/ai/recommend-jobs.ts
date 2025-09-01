// apps/functions/src/ai/recommend-jobs.ts
import { Handler } from '@netlify/functions'
import { JobRecommendationEngine } from '@ai-resume-agent/job-recommender'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { resume, options = {} } = JSON.parse(event.body || '{}')
    
    if (!resume) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '缺少简历数据' })
      }
    }

    const engine = new JobRecommendationEngine(process.env.OPENAI_API_KEY!)
    const recommendations = await engine.recommendJobs(resume, options)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: recommendations,
        count: recommendations.length
      })
    }
  } catch (error) {
    console.error('职位推荐API错误:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: '推荐服务暂时不可用'
      })
    }
  }
}
