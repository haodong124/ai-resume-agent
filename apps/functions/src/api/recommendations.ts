// apps/functions/src/api/recommendations.ts
import { Handler } from '@netlify/functions'
import { supabase } from '../lib/supabase'
import { createEmbedding, calculateSimilarity } from '../lib/ai-utils'

export const recommendJobs: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { resumeId, userId, filters = {} } = JSON.parse(event.body || '{}')

    // 1. 获取用户简历
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', userId)
      .single()

    if (resumeError || !resume) {
      return { statusCode: 404, body: JSON.stringify({ error: '简历未找到' }) }
    }

    // 2. 如果没有embedding，生成embedding
    let resumeEmbedding = resume.embedding
    if (!resumeEmbedding) {
      const resumeText = extractTextFromResume(resume.content)
      resumeEmbedding = await createEmbedding(resumeText)
      
      // 保存embedding
      await supabase
        .from('resumes')
        .update({ embedding: resumeEmbedding })
        .eq('id', resumeId)
    }

    // 3. 向量搜索匹配职位
    const { data: jobs, error: jobsError } = await supabase.rpc(
      'match_jobs_by_embedding',
      {
        query_embedding: resumeEmbedding,
        match_threshold: 0.7,
        match_count: 20
      }
    )

    if (jobsError) {
      throw jobsError
    }

    // 4. 详细匹配分析
    const recommendations = await Promise.all(
      jobs.map(async (job: any) => {
        const matchAnalysis = await analyzeJobMatch(resume.content, job)
        return {
          ...job,
          matchScore: matchAnalysis.totalScore,
          matchDetails: matchAnalysis.details,
          reasons: matchAnalysis.reasons,
          improvements: matchAnalysis.improvements
        }
      })
    )

    // 5. 应用过滤器和排序
    let filteredRecommendations = recommendations
    
    if (filters.location) {
      filteredRecommendations = filteredRecommendations.filter(
        job => job.location?.includes(filters.location)
      )
    }
    
    if (filters.salaryMin) {
      filteredRecommendations = filteredRecommendations.filter(
        job => (job.salary_max || 0) >= filters.salaryMin
      )
    }

    // 按匹配度排序
    filteredRecommendations.sort((a, b) => b.matchScore - a.matchScore)

    // 6. 保存推荐记录
    const recommendationRecords = filteredRecommendations.slice(0, 10).map(job => ({
      user_id: userId,
      job_id: job.id,
      resume_id: resumeId,
      match_score: job.matchScore,
      match_details: job.matchDetails
    }))

    await supabase
      .from('job_recommendations')
      .insert(recommendationRecords)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          recommendations: filteredRecommendations.slice(0, 10),
          total: filteredRecommendations.length
        }
      })
    }

  } catch (error) {
    console.error('Recommendation error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '推荐服务暂时不可用' })
    }
  }
}

// 辅助函数
function extractTextFromResume(content: any): string {
  // 从简历JSON中提取文本内容
  const parts = []
  
  if (content.personalInfo) {
    parts.push(content.personalInfo.summary || '')
  }
  
  if (content.experience) {
    content.experience.forEach((exp: any) => {
      parts.push(`${exp.position} ${exp.company} ${exp.description || ''}`)
    })
  }
  
  if (content.skills) {
    parts.push(content.skills.join(' '))
  }
  
  if (content.projects) {
    content.projects.forEach((project: any) => {
      parts.push(`${project.name} ${project.description || ''}`)
    })
  }
  
  return parts.join(' ')
}

async function analyzeJobMatch(resumeContent: any, job: any) {
  // 这里可以集成更复杂的AI分析
  // 暂时用简单的关键词匹配
  
  const resumeSkills = new Set(
    (resumeContent.skills || []).map((s: string) => s.toLowerCase())
  )
  
  const jobSkills = new Set(
    (job.skills || []).map((s: string) => s.toLowerCase())
  )
  
  const skillMatches = [...resumeSkills].filter(skill => jobSkills.has(skill))
  const skillScore = skillMatches.length / Math.max(jobSkills.size, 1) * 100
  
  return {
    totalScore: Math.min(skillScore + job.similarity * 20, 100),
    details: {
      skillMatch: skillScore,
      semanticSimilarity: job.similarity * 100,
      experienceMatch: 75, // 简化计算
      locationMatch: 90
    },
    reasons: [
      `技能匹配: ${skillMatches.join(', ')}`,
      `相似度: ${(job.similarity * 100).toFixed(1)}%`
    ],
    improvements: jobSkills.size > skillMatches.length ? 
      [`建议学习: ${[...jobSkills].filter(s => !resumeSkills.has(s)).slice(0, 3).join(', ')}`] : 
      []
  }
}
