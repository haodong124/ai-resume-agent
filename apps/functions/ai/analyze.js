exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { resume } = JSON.parse(event.body)
    
    // 模拟AI分析
    const analysis = {
      score: Math.floor(Math.random() * 30) + 70,
      strengths: [
        '工作经历描述清晰',
        '技能与职位相关',
        '教育背景符合要求'
      ],
      improvements: [
        '添加更多量化成果',
        '增加项目经历描述',
        '优化技能关键词'
      ],
      keywords: {
        found: ['React', 'JavaScript', 'Git'],
        missing: ['TypeScript', 'Docker', 'CI/CD']
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(analysis)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Analysis failed' })
    }
  }
}
