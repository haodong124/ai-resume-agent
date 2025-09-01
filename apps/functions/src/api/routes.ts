// apps/functions/src/api/routes.ts
// RESTful API 路由定义和实现

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { JobRecommendationEngine } from '@ai-resume-agent/job-recommender'
import { CareerAdvisor } from '@ai-resume-agent/career-advisor'
import { InterviewAgent } from '@ai-resume-agent/interview-agent'
import { AgentCore } from '@ai-resume-agent/agent-core'

// API响应格式标准化
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// 创建标准化响应
const createResponse = <T>(statusCode: number, data: T | null, error?: string): any => ({
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
  } as ApiResponse)
})

// 错误处理中间件
const handleError = (error: any, context: string) => {
  console.error(`${context} 错误:`, error)
  return createResponse(500, null, `${context}失败，请稍后重试`)
}
