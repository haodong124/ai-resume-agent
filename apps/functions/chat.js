const OpenAI = require('openai')

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { messages, context } = JSON.parse(event.body || '{}')
    
    // 如果有OpenAI key，使用真实API
    if (process.env.VITE_OPENAI_API_KEY) {
      const openai = new OpenAI({
        apiKey: process.env.VITE_OPENAI_API_KEY
      })

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "你是一个专业的职业顾问，帮助用户优化简历和职业发展。" },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: {
            content: completion.choices[0].message.content,
            suggestions: []
          }
        })
      }
    } else {
      // 模拟响应
      const responses = [
        "基于你的背景，我建议突出你的React和TypeScript技能。",
        "你的项目经历很丰富，建议添加具体的成果数据。",
        "考虑添加一些量化的成就，比如提升了多少效率。",
        "你的技能组合很适合全栈开发职位。"
      ]

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: {
            content: responses[Math.floor(Math.random() * responses.length)],
            suggestions: ['添加量化成果', '优化关键词', '突出核心技能']
          }
        })
      }
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: '聊天服务暂时不可用' 
      })
    }
  }
}
