import { AgentPlan, AgentStep } from '../types'
import { LLMRouter } from '../llm/router'

interface GraphNode {
  id: string
  type: 'start' | 'end' | 'action' | 'decision'
  action?: string
  next?: string[]
  condition?: string
}

export class GraphPlanner {
  constructor(private llm: LLMRouter) {}
  
  async plan(intent: string, context: any): Promise<AgentPlan> {
    const graph = await this.buildGraph(intent, context)
    const steps = this.graphToSteps(graph)
    
    return {
      steps,
      strategy: 'conditional'
    }
  }
  
  private async buildGraph(intent: string, context: any): Promise<GraphNode[]> {
    // Build execution graph based on intent
    const graphs: Record<string, GraphNode[]> = {
      'analyze_resume': [
        { id: 'start', type: 'start', next: ['parse'] },
        { id: 'parse', type: 'action', action: 'Parse resume content', next: ['validate'] },
        { id: 'validate', type: 'action', action: 'Validate format', next: ['decision1'] },
        { id: 'decision1', type: 'decision', condition: 'Is valid?', next: ['analyze', 'fix'] },
        { id: 'fix', type: 'action', action: 'Fix formatting issues', next: ['analyze'] },
        { id: 'analyze', type: 'action', action: 'Deep analysis', next: ['suggest'] },
        { id: 'suggest', type: 'action', action: 'Generate suggestions', next: ['end'] },
        { id: 'end', type: 'end' }
      ],
      'default': [
        { id: 'start', type: 'start', next: ['process'] },
        { id: 'process', type: 'action', action: 'Process request', next: ['end'] },
        { id: 'end', type: 'end' }
      ]
    }
    
    return graphs[intent] || graphs['default']
  }
  
  private graphToSteps(graph: GraphNode[]): AgentStep[] {
    const steps: AgentStep[] = []
    const visited = new Set<string>()
    
    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return
      visited.add(nodeId)
      
      const node = graph.find(n => n.id === nodeId)
      if (!node || node.type === 'end') return
      
      if (node.type === 'action' && node.action) {
        steps.push({
          name: node.action,
          input: { nodeId, type: node.type }
        })
      }
      
      if (node.next) {
        node.next.forEach(nextId => traverse(nextId))
      }
    }
    
    traverse('start')
    return steps
  }
}
