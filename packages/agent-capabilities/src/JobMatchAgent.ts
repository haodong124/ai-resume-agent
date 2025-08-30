import { AgentCore } from '@ai-resume-agent/agent-core'
import { ResumeData } from '@ai-resume-agent/ui-bridge'

export class JobMatchAgent {
  constructor(private agent: AgentCore) {}
  
  async analyzeMatch(resume: ResumeData, jobDescription: string) {
    const prompt = `
      Analyze job match between resume and JD.
      
      Resume: ${JSON.stringify(resume)}
      Job Description: ${jobDescription}
      
      Return JSON with:
      - score: 0-100
      - matched: array of matched keywords
      - missing: array of missing keywords
      - gaps: array of gap objects with category, description, priority
      - suggestions: 5-8 specific actionable improvements
    `
    
    return await this.agent.process('analyze_match', {
      resume,
      jobDescription,
      prompt
    })
  }
}
