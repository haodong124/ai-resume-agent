// ========== apps/functions/analyze-resume.js ==========
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { resume } = JSON.parse(event.body || '{}')
    
    // 模拟分析结果（实际应调用OpenAI）
    const analysis = {
      score: 75,
      strengths: [
        '技能覆盖全面',
        '工作经验丰富',
        '项目经历突出'
      ],
      weaknesses: [
        '缺少量化成果',
        '技能描述不够具体',
        '缺少关键词优化'
      ],
      suggestions: [
        '添加具体的项目成果数据',
        '使用更多行业关键词',
        '突出核心技能'
      ],
      keywordAnalysis: {
        present: ['React', 'TypeScript', 'Node.js'],
        missing: ['AWS', 'Docker', 'CI/CD'],
        density: 0.15
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: analysis
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: '分析服务暂时不可用' 
      })
    }
  }
}
