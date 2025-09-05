// ========== apps/functions/recommend-jobs.js ==========
const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { resumeId, userId, filters } = JSON.parse(event.body || '{}')
    
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    )

    // 获取职位列表
    let query = supabase
      .from('job_listings')
      .select('*')
      .eq('is_active', true)
      .limit(20)

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters?.salaryMin) {
      query = query.gte('salary_min', filters.salaryMin)
    }

    const { data: jobs, error } = await query

    if (error) throw error

    // 简单匹配打分
    const recommendations = jobs.map(job => ({
      ...job,
      matchScore: Math.floor(Math.random() * 30 + 70), // 临时随机分数
      matchDetails: {
        skillMatch: 75,
        experienceMatch: 80,
        locationMatch: 90,
        semanticSimilarity: 70
      },
      reasons: ['技能匹配', '位置合适', '薪资范围符合'],
      improvements: []
    }))

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          recommendations: recommendations.sort((a, b) => b.matchScore - a.matchScore),
          total: recommendations.length
        }
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: '推荐服务暂时不可用' 
      })
    }
  }
}
