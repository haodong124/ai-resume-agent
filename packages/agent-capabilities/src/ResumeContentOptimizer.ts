// packages/agent-capabilities/src/ResumeContentOptimizer.ts
import { AgentCore } from '@ai-resume-agent/agent-core'
import { ResumeData } from '@ai-resume-agent/ui-bridge'

export class ResumeContentOptimizer {
  constructor(private agent: AgentCore) {}
  
  async optimizeContent(content: string, type: 'experience' | 'project' | 'summary') {
    const prompt = `
      Optimize this ${type} content following STAR method.
      Original: ${content}
      
      Rules:
      1. Start with action verb
      2. Include quantified results
      3. Show business impact
      4. Keep under 2 lines
      
      Return JSON with original, optimized, improvements, and score.
    `
    
    return await this.agent.process('optimize_content', {
      content,
      type,
      prompt
    })
  }
  
  async generateSTAR(experience: string) {
    const prompt = `
      Convert to STAR format:
      ${experience}
      
      Return:
      - Situation: Context
      - Task: Responsibility  
      - Action: What you did
      - Result: Quantified outcome
    `
    
    return await this.agent.process('generate_star', {
      experience,
      prompt
    })
  }
}
