import { AgentCore } from '@ai-resume-agent/agent-core'

export class SkillRecommendAgent {
  constructor(private agent: AgentCore) {}
  
  async recommendSkills(education: any[], experience: any[]) {
    const prompt = `
      Based on education and experience, recommend 12-15 skills.
      
      Education: ${JSON.stringify(education)}
      Experience: ${JSON.stringify(experience)}
      
      For each skill return:
      - name: skill name
      - level: beginner/intermediate/advanced
      - category: skill category
      - reason: why recommended
      - priority: high/medium/low
      - salaryImpact: expected salary increase
      - learningTime: time to learn
      
      Group by: Core Skills, Tools, Soft Skills, Emerging Skills
    `
    
    return await this.agent.process('recommend_skills', {
      education,
      experience,
      prompt
    })
  }
}
