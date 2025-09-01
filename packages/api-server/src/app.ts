// packages/api-server/src/app.ts
import fastify from 'fastify'
import { JobRecommendationService } from './services/JobRecommendationService'
import { InterviewService } from './services/InterviewService'

const server = fastify({ logger: true })

// 插件注册
server.register(require('@fastify/cors'))
server.register(require('@fastify/jwt'))
server.register(require('@fastify/rate-limit'))

// 服务注册
const jobService = new JobRecommendationService()
const interviewService = new InterviewService()

// 路由定义
server.register(async function (fastify) {
  fastify.post('/api/recommendations/jobs', jobService.recommend)
  fastify.post('/api/interview/start', interviewService.startSession)
  // ... 其他路由
})
