export interface AgentIntent {
  name: string
  description: string
  parameters: Record<string, any>
}

export interface AgentResponse {
  success: boolean
  results: any[]
  error?: string
  metadata?: Record<string, any>
}

export interface Tool {
  name: string
  description: string
  execute: (params: any) => Promise<any>
}

export interface Memory {
  id: string
  timestamp: Date
  content: any
  type: 'short' | 'long' | 'vector'
}

export interface AgentStep {
  name: string
  input: any
  output?: any
  error?: string
  duration?: number
}

export interface AgentPlan {
  steps: AgentStep[]
  strategy: 'sequential' | 'parallel' | 'conditional'
}
