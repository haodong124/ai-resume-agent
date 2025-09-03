// apps/functions/ai-match.ts
import { Handler } from '@netlify/functions'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
})

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { resume, jobDescription } = JSON.parse(event.body || '{}')

    if (!resume || !jobDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Resume and job description are required' })
      }
    }

    const prompt = `分析以下简历与职位描述的匹配度：

简历：
${JSON.stringify(resume, null, 2)}

职位描述：
${jobDescription}

请提供详细分析，包括：
1. 整体匹配度评分（0-100）
2. 匹配的技能和经验
3. 缺失的关键要求
4. 改进建议
5. 面试准备要点

以JSON格式返回结果。`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一位经验丰富的招聘专家，擅长分析候选人与职位的匹配度。'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    })

    const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}')

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        analysis,
        usage: completion.usage
      })
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: '分析服务暂时不可用'
      })
    }
  }
}
