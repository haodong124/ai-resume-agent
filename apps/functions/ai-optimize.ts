// apps/functions/ai-optimize.ts
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
    const { resume } = JSON.parse(event.body || '{}')

    if (!resume) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Resume data is required' })
      }
    }

    const prompt = `作为专业的简历优化专家，请分析并优化以下简历内容：

简历数据：
${JSON.stringify(resume, null, 2)}

请提供：
1. 整体评分（0-100）
2. 各部分的具体优化建议
3. 关键词优化建议
4. ATS友好度分析
5. 具体的改进示例

请以JSON格式返回结果。`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的简历优化专家，精通ATS系统和各行业的招聘标准。'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        optimization: result,
        usage: completion.usage
      })
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: '优化服务暂时不可用'
      })
    }
  }
}
