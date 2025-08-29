import { ResumeData } from '@ai-resume-agent/ui-bridge'

const API_BASE = import.meta.env.VITE_API_URL || '/.netlify/functions'

export class ResumeAPI {
  static async analyzeResume(data: ResumeData) {
    const response = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) throw new Error('分析失败')
    return response.json()
  }
  
  static async getSuggestions(data: ResumeData) {
    const response = await fetch(`${API_BASE}/ai/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) throw new Error('获取建议失败')
    return response.json()
  }
  
  static async matchJobs(data: ResumeData, jobDescription: string) {
    const response = await fetch(`${API_BASE}/ai/match-jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: data, job: jobDescription }),
    })
    
    if (!response.ok) throw new Error('匹配失败')
    return response.json()
  }
  
  static async extractKeywords(text: string) {
    const response = await fetch(`${API_BASE}/ai/extract-keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    
    if (!response.ok) throw new Error('提取关键词失败')
    return response.json()
  }
}
