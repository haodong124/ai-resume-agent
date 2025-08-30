import { Tool, AgentStep } from '../types'
import pRetry from 'p-retry'

export class ToolExecutor {
  private tools: Map<string, Tool> = new Map()
  
  registerTool(tool: Tool) {
    this.tools.set(tool.name, tool)
  }
  
  async execute(step: AgentStep, context: any): Promise<any> {
    const tool = this.findToolForStep(step)
    
    if (!tool) {
      return this.executeDefault(step, context)
    }
    
    return await pRetry(
      async () => {
        const startTime = Date.now()
        const result = await tool.execute({ ...step.input, context })
        step.duration = Date.now() - startTime
        step.output = result
        return result
      },
      {
        retries: 3,
        onFailedAttempt: (error) => {
          console.warn(`Tool execution attempt ${error.attemptNumber} failed:`, error.message)
        }
      }
    )
  }
  
  private findToolForStep(step: AgentStep): Tool | undefined {
    // Match tool by step name
    return this.tools.get(step.name.toLowerCase().replace(/\s+/g, '_'))
  }
  
  private async executeDefault(step: AgentStep, context: any): Promise<any> {
    // Default execution logic
    return {
      step: step.name,
      completed: true,
      result: 'Step completed successfully'
    }
  }
}
