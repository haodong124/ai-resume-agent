// apps/web/src/services/openai.ts

// OpenAI API 服务 - 通过 Netlify Functions 调用
export const openaiService = {
  // AI 职业顾问聊天
  async chat(message: string, context?: any) {
    try {
      const response = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      })
      
      if (!response.ok) throw new Error('API request failed')
      return await response.json()
    } catch (error) {
      console.error('Chat API error:', error)
      throw error
    }
  },

  // 简历优化
  async optimizeResume(resumeData: any) {
    try {
      const response = await fetch('/.netlify/functions/ai-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeData })
      })
      
      if (!response.ok) throw new Error('API request failed')
      return await response.json()
    } catch (error) {
      console.error('Optimize API error:', error)
      throw error
    }
  },

  // 职位匹配分析
  async analyzeJobMatch(resume: any, jobDescription: string) {
    try {
      const response = await fetch('/.netlify/functions/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription })
      })
      
      if (!response.ok) throw new Error('API request failed')
      return await response.json()
    } catch (error) {
      console.error('Match API error:', error)
      throw error
    }
  },

  // 生成简历内容建议
  async generateSuggestions(section: string, currentContent: string) {
    try {
      const response = await fetch('/.netlify/functions/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, content: currentContent })
      })
      
      if (!response.ok) throw new Error('API request failed')
      return await response.json()
    } catch (error) {
      console.error('Suggest API error:', error)
      throw error
    }
  }
}
