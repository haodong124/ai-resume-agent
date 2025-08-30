import { AgentPlan, AgentStep } from '../types'
import { LLMRouter } from '../llm/router'

export class RulePlanner {
  constructor(private llm: LLMRouter) {}
  
  async plan(intent: string, context: any): Promise<AgentPlan> {
    const rules = this.getRulesForIntent(intent)
    const steps = await this.generateSteps(intent, context, rules)
    
    return {
      steps,
      strategy: this.determineStrategy(steps)
    }
  }
  
  private getRulesForIntent(intent: string): string[] {
    const ruleMap: Record<string, string[]> = {
      'analyze_resume': [
        'Extract key information',
        'Check formatting',
        'Validate content',
        'Generate suggestions'
      ],
      'optimize_content': [
        'Parse original content',
        'Apply STAR method',
        'Add quantification',
        'Enhance keywords'
      ],
      'match_jobs': [
        'Extract job requirements',
        'Extract resume keywords',
        'Calculate match score',
        'Generate gap analysis'
      ],
      'recommend_skills': [
        'Analyze background',
        'Research market trends',
        'Match to career goals',
        'Create learning path'
      ]
    }
    
    return ruleMap[intent] || ['Process request']
  }
  
  private async generateSteps(
    intent: string,
    context: any,
    rules: string[]
  ): Promise<AgentStep[]> {
    return rules.map(rule => ({
      name: rule,
      input: { intent, context, rule }
    }))
  }
  
  private determineStrategy(steps: AgentStep[]): 'sequential' | 'parallel' | 'conditional' {
    // Simple heuristic - can be made more sophisticated
    if (steps.length <= 2) return 'parallel'
    if (steps.some(s => s.name.includes('conditional'))) return 'conditional'
    return 'sequential'
  }
}
