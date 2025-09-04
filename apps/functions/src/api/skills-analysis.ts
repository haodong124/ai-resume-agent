// apps/functions/src/api/skills-analysis.ts
import { Handler } from '@netlify/functions'
import { supabase } from '../lib/supabase'
import { generateText, createEmbedding } from '../lib/ai-utils'

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

export const analyzeSkills: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200)
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { resume, targetRole } = JSON.parse(event.body || '{}')

    if (!resume) {
      return createResponse(400, null, '缺少简历数据')
    }

    // 1. 分析当前技能
    const currentSkills = await analyzeCurrentSkills(resume)

    // 2. 获取目标职位要求
    const targetRequirements = await getTargetRoleRequirements(targetRole)

    // 3. 识别技能缺口
    const skillGaps = await identifySkillGaps(currentSkills, targetRequirements)

    // 4. 生成学习路径
    const learningPaths = await generateLearningPaths(targetRole, skillGaps)

    return createResponse(200, {
      currentSkills,
      skillGaps,
      learningPaths,
      targetRole,
      analysisDate: new Date().toISOString()
    })

  } catch (error) {
    console.error('技能分析失败:', error)
    return createResponse(500, null, '技能分析服务暂时不可用')
  }
}

async function analyzeCurrentSkills(resume: any) {
  const skills = resume.skills || []
  const experience = resume.experience || []
  const projects = resume.projects || []

  // 从经验和项目中提取技能
  const extractedSkills = new Set(skills)
  
  // 简单的关键词提取
  const techKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
    'Python', 'Java', 'Go', 'PHP', 'MySQL', 'MongoDB', 'PostgreSQL',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'CI/CD'
  ]

  experience.forEach((exp: any) => {
    const description = (exp.description || '').toLowerCase()
    techKeywords.forEach(keyword => {
      if (description.includes(keyword.toLowerCase())) {
        extractedSkills.add(keyword)
      }
    })
  })

  // 评估技能水平（简化版本）
  return Array.from(extractedSkills).map(skill => ({
    name: skill,
    level: Math.floor(Math.random() * 3) + 6, // 6-8随机分数
    category: categorizeSkill(skill),
    trending: isTrendingSkill(skill),
    marketDemand: getMarketDemand(skill)
  }))
}

function categorizeSkill(skill: string): 'technical' | 'framework' | 'tool' | 'soft' {
  const categories = {
    technical: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'PHP'],
    framework: ['React', 'Vue', 'Angular', 'Express', 'Django', 'Spring'],
    tool: ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'Webpack', 'Vite'],
    soft: ['Communication', 'Leadership', 'Problem Solving', 'Team Work']
  }

  for (const [category, skills] of Object.entries(categories)) {
    if (skills.some(s => skill.toLowerCase().includes(s.toLowerCase()))) {
      return category as any
    }
  }
  return 'technical'
}

function isTrendingSkill(skill: string): boolean {
  const trendingSkills = ['TypeScript', 'React', 'Vue', 'Node.js', 'Docker', 'Kubernetes', 'Next.js']
  return trendingSkills.some(s => skill.toLowerCase().includes(s.toLowerCase()))
}

function getMarketDemand(skill: string): number {
  const demandMap: Record<string, number> = {
    'JavaScript': 95,
    'TypeScript': 90,
    'React': 90,
    'Node.js': 85,
    'Python': 88,
    'Docker': 80,
    'AWS': 85,
    'Git': 95
  }
  
  return demandMap[skill] || 70
}

async function getTargetRoleRequirements(targetRole: string) {
  // 预定义的职位要求
  const roleRequirements: Record<string, string[]> = {
    '前端开发工程师': ['JavaScript', 'TypeScript', 'React', 'CSS', 'HTML', 'Webpack'],
    '全栈开发工程师': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
    '后端开发工程师': ['Node.js', 'Express', 'MongoDB', 'MySQL', 'Redis', 'Docker'],
    '前端架构师': ['JavaScript', 'TypeScript', 'React', 'Vue', '微前端', '性能优化', 'Webpack']
  }

  return roleRequirements[targetRole] || ['JavaScript', 'React', 'Node.js']
}

async function identifySkillGaps(currentSkills: any[], requiredSkills: string[]) {
  const currentSkillNames = currentSkills.map(s => s.name)
  const gaps = []

  for (const requiredSkill of requiredSkills) {
    if (!currentSkillNames.some(current => 
      current.toLowerCase().includes(requiredSkill.toLowerCase()) ||
      requiredSkill.toLowerCase().includes(current.toLowerCase())
    )) {
      gaps.push({
        skill: requiredSkill,
        importance: getSkillImportance(requiredSkill),
        difficulty: getLearningDifficulty(requiredSkill),
        resources: getLearningResources(requiredSkill),
        estimatedTime: getEstimatedLearningTime(requiredSkill)
      })
    }
  }

  return gaps
}

function getSkillImportance(skill: string): number {
  const importanceMap: Record<string, number> = {
    'TypeScript': 90,
    'React': 85,
    'Node.js': 80,
    'Docker': 75,
    'AWS': 70,
    'Webpack': 65
  }
  return importanceMap[skill] || 70
}

function getLearningDifficulty(skill: string): number {
  const difficultyMap: Record<string, number> = {
    'TypeScript': 60,
    'React': 65,
    'Node.js': 70,
    'Docker': 80,
    'Kubernetes': 90,
    'AWS': 75
  }
  return difficultyMap[skill] || 65
}

function getLearningResources(skill: string): string[] {
  const resourceMap: Record<string, string[]> = {
    'TypeScript': ['TypeScript官方文档', '《深入理解TypeScript》', 'TypeScript实战课程'],
    'React': ['React官方教程', '《React进阶指南》', 'React Hooks实践'],
    'Docker': ['Docker从入门到实践', 'Docker官方教程', 'Kubernetes基础'],
    'AWS': ['AWS官方培训', 'AWS Solutions Architect认证', 'AWS实战指南']
  }
  return resourceMap[skill] || ['相关官方文档', '在线教程', '实战项目']
}

function getEstimatedLearningTime(skill: string): string {
  const timeMap: Record<string, string> = {
    'TypeScript': '2-3周',
    'React': '3-4周',
    'Node.js': '4-6周',
    'Docker': '4-6周',
    'Kubernetes': '8-12周',
    'AWS': '6-8周'
  }
  return timeMap[skill] || '2-4周'
}

async function generateLearningPaths(targetRole: string, skillGaps: any[]) {
  const pathTemplates = {
    '前端开发工程师': [
      {
        id: '1',
        title: '现代前端开发专家',
        description: '掌握现代前端开发的核心技能和最佳实践',
        skills: ['TypeScript', 'React Hooks', 'Next.js', 'Testing'],
        duration: '8-10周',
        difficulty: 'intermediate' as const,
        priority: 90
      }
    ],
    '全栈开发工程师': [
      {
        id: '2',
        title: '全栈JavaScript开发者',
        description: '成为能够独立开发完整应用的全栈工程师',
        skills: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
        duration: '12-16周',
        difficulty: 'advanced' as const,
        priority: 95
      }
    ]
  }

  return pathTemplates[targetRole as keyof typeof pathTemplates] || []
}

export const generateLearningPath: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return createResponse(405, null, 'Method Not Allowed')
  }

  try {
    const { skills, targetRole, timeframe } = JSON.parse(event.body || '{}')

    const prompt = `
作为专业的职业规划师，请为以下目标制定详细的学习计划：

目标职位：${targetRole}
需要学习的技能：${skills.join(', ')}
时间框架：${timeframe}

请提供：
1. 分阶段的学习计划
2. 每个阶段的具体目标
3. 推荐的学习资源
4. 实践项目建议
5. 评估检验方法

以JSON格式返回：
{
  "phases": [
    {
      "phase": 1,
      "title": "阶段标题",
      "duration": "持续时间",
      "goals": ["目标1", "目标2"],
      "resources": ["资源1", "资源2"],
      "projects": ["项目1", "项目2"],
      "evaluation": "评估方法"
    }
  ],
  "totalDuration": "总时长",
  "successMetrics": ["成功指标1", "成功指标2"]
}
`

    const response = await generateText(prompt)
    const learningPlan = JSON.parse(response)

    return createResponse(200, learningPlan)

  } catch (error) {
    console.error('学习路径生成失败:', error)
    return createResponse(500, null, '学习路径生成失败')
  }
}
