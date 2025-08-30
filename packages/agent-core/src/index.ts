import { LLMRouter } from './llm/router'
import { ToolExecutor } from './executor/ToolExecutor'
import { ShortTermMemory } from './memory/ShortTermMemory'
import { RulePlanner } from './planner/RulePlanner'
import { AgentResponse, AgentIntent } from './types'

export interface AgentConfig {
  llm: 'openai' | 'anthropic' | 'mock'
  apiKey?: string
  temperature?: number
  maxTokens?: number
}

export class AgentCore {
  private llm: LLMRouter
  private executor: ToolExecutor
  private memory: ShortTermMemory
  private planner: RulePlanner
  
  constructor(config: AgentConfig) {
    this.llm = new LLMRouter(config)
    this.executor = new ToolExecutor()
    this.memory = new ShortTermMemory()
    this.planner = new RulePlanner(this.llm)
  }
  
  async process(intent: string, context: any): Promise<AgentResponse> {
    try {
      // 1. Plan the execution
      const plan = await this.planner.plan(intent, context)
      
      // 2. Execute steps
      const results = []
      for (const step of plan.steps) {
        const result = await this.executor.execute(step, context)
        results.push(result)
        
        // 3. Store in memory
        this.memory.add({
          step: step.name,
          input: step.input,
          output: result
        })
      }
      
      // 4. Return response
      return {
        success: true,
        results,
        metadata: {
          intent,
          steps: plan.steps.length,
          strategy: plan.strategy
        }
      }
    } catch (error) {
      console.error('Agent processing error:', error)
      return {
        success: false,
        results: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  getMemory() {
    return this.memory.getAll()
  }
  
  clearMemory() {
    this.memory.clear()
  }
}

export * from './types'
