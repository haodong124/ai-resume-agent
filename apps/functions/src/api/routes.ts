// apps/functions/src/api/routes.ts
import { Handler, HandlerEvent } from '@netlify/functions'

// 标准化响应格式
const createResponse = (statusCode: number, data: any = null, error?: string) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  },
  body: JSON.stringify({
    success: statusCode < 400,
    data,
    error,
    timestamp: new Date().toISOString()
  })
})

// ================================
// 1. 职位推荐 API
// ================================

export const recommendJobs: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200)
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { resume, options = {} } = JSON.parse(event.body || '{}')
    
    if (!resume) {
      return createResponse(400, null, '缺少简历数据')
    }

    // 模拟推荐逻辑
    const recommendations = [
      {
        jobId: '1',
        title: '前端开发工程师',
        company: '字节跳动',
        location: '北京',
        matchScore: 87,
        salaryRange: [25000, 40000],
        requiredSkills: ['JavaScript', 'React', 'TypeScript'],
        missingSkills: ['TypeScript'],
        reasons: [
          { type: 'skill_match', description: '你拥有所需技能：React' }
        ]
      }
    ]

    return createResponse(200, {
      recommendations,
      count: recommendations.length
    })

  } catch (error) {
    console.error('职位推荐错误:', error)
    return createResponse(500, null, '推荐服务暂时不可用')
  }
}

export const explainRecommendation: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { jobId, resume } = JSON.parse(event.body || '{}')
    
    if (!jobId || !resume) {
      return createResponse(400, null, '缺少必要参数')
    }

    const explanation = `职位匹配度分析：
1. 技能匹配：你拥有该职位所需的核心技能
2. 经验符合：工作经验与职位要求相符
3. 建议提升：学习TypeScript可以提高匹配度`

    return createResponse(200, { explanation, jobId })

  } catch (error) {
    console.error('推荐解释错误:', error)
    return createResponse(500, null, '解释生成失败')
  }
}

// ================================
// 2. 模拟面试 API
// ================================

export const startInterview: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { job_type, difficulty_level = 'intermediate' } = JSON.parse(event.body || '{}')
    
    if (!job_type) {
      return createResponse(400, null, '缺少面试类型参数')
    }

    const session = {
      session_id: `session_${Date.now()}`,
      job_type,
      difficulty_level,
      first_question: '请简单介绍一下自己',
      total_questions: 5,
      started_at: new Date().toISOString()
    }

    return createResponse(200, session)

  } catch (error) {
    console.error('面试开始错误:', error)
    return createResponse(500, null, '面试开始失败')
  }
}

export const submitAnswer: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { session_id, question_id, answer } = JSON.parse(event.body || '{}')
    
    if (!session_id || !question_id || !answer) {
      return createResponse(400, null, '缺少必要参数')
    }

    const evaluation = {
      session_id,
      question_id,
      overall_score: 85,
      feedback: '回答清晰，逻辑合理',
      improvements: ['可以更具体地描述技术细节'],
      next_question: '请描述一个你解决过的技术难题',
      is_final: false
    }

    return createResponse(200, evaluation)

  } catch (error) {
    console.error('回答评估错误:', error)
    return createResponse(500, null, '评估失败')
  }
}

// ================================
// 3. 职业咨询 API
// ================================

export const careerChat: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { message, context } = JSON.parse(event.body || '{}')
    
    if (!message || !context?.user_id) {
      return createResponse(400, null, '缺少消息内容或用户信息')
    }

    const response = {
      message_id: Date.now().toString(),
      session_id: `session_${Date.now()}`,
      response: {
        content: '这是AI的职业建议回答...',
        follow_up_questions: ['你希望了解更多关于哪个方面？'],
        action_items: ['准备技术面试', '优化简历内容'],
        confidence: 0.85
      }
    }

    return createResponse(200, response)

  } catch (error) {
    console.error('职业咨询错误:', error)
    return createResponse(500, null, '咨询服务暂时不可用')
  }
}

// ================================
// 4. 技能分析 API
// ================================

export const analyzeSkills: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { current_skills, target_job } = JSON.parse(event.body || '{}')
    
    if (!current_skills || !target_job) {
      return createResponse(400, null, '缺少技能数据或目标职位')
    }

    const analysis = {
      matched_skills: ['JavaScript', 'React'],
      missing_skills: ['TypeScript', 'Node.js'],
      skill_gap_percentage: 40,
      recommendations: [
        {
          skill: 'TypeScript',
          priority: 'high',
          estimated_learning_time: '2-3周',
          resources: ['TypeScript官方文档', 'TypeScript入门课程']
        }
      ]
    }

    return createResponse(200, { analysis })

  } catch (error) {
    console.error('技能分析错误:', error)
    return createResponse(500, null, '技能分析失败')
  }
}

export const generateLearningPath: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { current_skills, target_skills, available_hours_per_week = 10 } = JSON.parse(event.body || '{}')
    
    if (!current_skills || !target_skills) {
      return createResponse(400, null, '缺少当前技能或目标技能')
    }

    const learningPath = {
      total_estimated_weeks: 8,
      weekly_commitment: available_hours_per_week,
      learning_phases: [
        {
          phase: 1,
          title: '基础技能建设',
          duration_weeks: 4,
          skills: ['JavaScript', 'HTML/CSS'],
          resources: [
            { type: 'course', title: 'JavaScript基础', estimated_hours: 20 }
          ]
        }
      ],
      milestones: [
        { week: 2, description: '完成第一个项目' }
      ]
    }

    return createResponse(200, { learning_path: learningPath })

  } catch (error) {
    console.error('学习路径生成错误:', error)
    return createResponse(500, null, '学习路径生成失败')
  }
}

// ================================
// 5. 简历管理 API
// ================================

export const saveResume: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { user_id, resume_data, title } = JSON.parse(event.body || '{}')
    
    if (!user_id || !resume_data) {
      return createResponse(400, null, '缺少用户ID或简历数据')
    }

    const result = {
      resume_id: `resume_${Date.now()}`,
      user_id,
      title: title || '我的简历',
      saved_at: new Date().toISOString()
    }

    return createResponse(200, result)

  } catch (error) {
    console.error('保存简历错误:', error)
    return createResponse(500, null, '保存简历失败')
  }
}
