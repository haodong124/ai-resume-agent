import { LLMRouter } from './llm/router'
import { ToolExecutor } from './executor/ToolExecutor'
import { ShortTermMemory } from './memory/ShortTermMemory'
import { RulePlanner } from './planner/RulePlanner'

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
  
  async process(intent: string, context: any) {
    // 1. 理解意图
    const plan = await this.planner.plan(intent, context)
    
    // 2. 执行计划
    const results = []
    for (const step of plan.steps) {
      const result = await this.executor.execute(step, context)
      results.push(result)
      
      // 3. 更新记忆
      this.memory.add({
        step: step.name,
        input: step.input,
        output: result,
      })
    }
    
    // 4. 综合结果
    return this.synthesize(results)
  }
  
  private synthesize(results: any[]) {
    // 综合所有步骤的结果
    return {
      success: true,
      results,
      summary: this.llm.summarize(results),
    }
  }
  
  getMemory() {
    return this.memory.getAll()
  }
  
  clearMemory() {
    this.memory.clear()
  }
}
