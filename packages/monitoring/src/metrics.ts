// packages/monitoring/src/metrics.ts
import { createPrometheusMetrics } from '@prometheus/client'

export const metrics = {
  httpRequests: new Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status']
  }),
  
  jobRecommendations: new Counter({
    name: 'job_recommendations_total',
    help: 'Total job recommendations generated'
  }),
  
  interviewSessions: new Counter({
    name: 'interview_sessions_total',
    help: 'Total interview sessions started'
  }),
  
  responseTime: new Histogram({
    name: 'response_time_seconds',
    help: 'Response time in seconds',
    buckets: [0.1, 0.5, 1, 2, 5]
  })
}
