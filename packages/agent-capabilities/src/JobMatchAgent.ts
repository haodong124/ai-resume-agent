import { AgentCore } from '@ai-resume-agent/agent-core'
import { ResumeData } from '@ai-resume-agent/ui-bridge'
import { z } from 'zod'

const MatchResultSchema = z.object({
  score: z.number().min(0).max(100),
  matched: z.array(z.string()),
  missing: z.array(z.string()),
  suggestions: z.array(z.string()),
  gaps: z.array(z.object({
    category: z.string(),
    description: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
  })),
})

type MatchResult = z.infer<typeof MatchResultSchema>

export class JobMatchAgent {
  constructor(private agent: AgentCore) {}
  
  async analyzeMatch(
    resume: ResumeData,
    jobDescription: string
  ): Promise<MatchResult> {
    // Step 1: Extract keywords from job description
    const jobKeywords = await this.extractJobKeywords(jobDescription)
    
    // Step 2: Extract keywords from resume
    const resumeKeywords = await this.extractResumeKeywords(resume)
    
    // Step 3: Calculate match
    const matchAnalysis = await this.calculateMatch(
      jobKeywords,
      resumeKeywords,
      resume,
      jobDescription
    )
    
    // Step 4: Generate suggestions
    const suggestions = await this.generateSuggestions(
      matchAnalysis,
      resume,
      jobDescription
    )
    
    return {
      ...matchAnalysis,
      suggestions,
    }
  }
  
  private async extractJobKeywords(jobDescription: string): Promise<string[]> {
    const result = await this.agent.process('extract_keywords', {
      text: jobDescription,
      type: 'job_description',
      categories: [
        'technical_skills',
        'soft_skills',
        'tools',
        'certifications',
        'experience_requirements',
      ],
    })
    
    return result.results.flatMap((r: any) => r.keywords)
  }
  
  private async extractResumeKeywords(resume: ResumeData): Promise<string[]> {
    const resumeText = this.resumeToText(resume)
    
    const result = await this.agent.process('extract_keywords', {
      text: resumeText,
      type: 'resume',
      categories: [
        'technical_skills',
        'soft_skills',
        'tools',
        'certifications',
        'achievements',
      ],
    })
    
    return result.results.flatMap((r: any) => r.keywords)
  }
  
  private async calculateMatch(
    jobKeywords: string[],
    resumeKeywords: string[],
    resume: ResumeData,
    jobDescription: string
  ): Promise<Omit<MatchResult, 'suggestions'>> {
    const jobSet = new Set(jobKeywords.map(k => k.toLowerCase()))
    const resumeSet = new Set(resumeKeywords.map(k => k.toLowerCase()))
    
    const matched = Array.from(jobSet).filter(k => resumeSet.has(k))
    const missing = Array.from(jobSet).filter(k => !resumeSet.has(k))
    
    // Calculate score
    const keywordScore = (matched.length / jobKeywords.length) * 100
    
    // Analyze gaps
    const gaps = await this.analyzeGaps(missing, jobDescription, resume)
    
    // Weighted score calculation
    const score = Math.round(
      keywordScore * 0.4 +
      this.calculateExperienceScore(resume, jobDescription) * 0.3 +
      this.calculateSkillScore(resume, matched) * 0.3
    )
    
    return {
      score: Math.min(100, Math.max(0, score)),
      matched,
      missing: missing.slice(0, 20), // Limit to top 20
      gaps,
    }
  }
  
  private async analyzeGaps(
    missingKeywords: string[],
    jobDescription: string,
    resume: ResumeData
  ): Promise<MatchResult['gaps']> {
    const result = await this.agent.process('analyze_gaps', {
      missing: missingKeywords,
      job: jobDescription,
      resume: this.resumeToText(resume),
      instruction: 'Identify the most critical gaps and categorize them',
    })
    
    return result.results.map((gap: any) => ({
      category: gap.category,
      description: gap.description,
      priority: gap.priority as 'high' | 'medium' | 'low',
    }))
  }
  
  private async generateSuggestions(
    matchAnalysis: Omit<MatchResult, 'suggestions'>,
    resume: ResumeData,
    jobDescription: string
  ): Promise<string[]> {
    const result = await this.agent.process('generate_suggestions', {
      score: matchAnalysis.score,
      gaps: matchAnalysis.gaps,
      missing: matchAnalysis.missing.slice(0, 10),
      resume: this.resumeToText(resume),
      job: jobDescription,
      instruction: 'Generate 5-8 actionable suggestions to improve the match',
    })
    
    return result.results.map((s: any) => s.suggestion)
  }
  
  private resumeToText(resume: ResumeData): string {
    const sections = [
      `Name: ${resume.personalInfo.name}`,
      `Title: ${resume.personalInfo.title || 'Not specified'}`,
      `Summary: ${resume.personalInfo.summary || 'Not provided'}`,
      
      'Experience:',
      ...resume.experience.map(exp => 
        `${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`
      ),
      
      'Education:',
      ...resume.education.map(edu => 
        `${edu.degree} in ${edu.major} from ${edu.school}`
      ),
      
      'Skills:',
      ...resume.skills.map(skill => 
        `${skill.name} (${skill.level}): ${skill.description || ''}`
      ),
      
      'Projects:',
      ...resume.projects.map(proj => 
        `${proj.name}: ${proj.description} - Technologies: ${proj.technologies}`
      ),
    ]
    
    return sections.join('\n')
  }
  
  private calculateExperienceScore(
    resume: ResumeData,
    jobDescription: string
  ): number {
    // Simple heuristic - can be made more sophisticated
    const totalExperience = resume.experience.length
    const relevantKeywords = ['senior', 'lead', 'manager', 'expert']
    const hasRelevantTitle = relevantKeywords.some(k => 
      jobDescription.toLowerCase().includes(k)
    )
    
    if (hasRelevantTitle && totalExperience < 3) return 50
    if (totalExperience >= 5) return 90
    if (totalExperience >= 3) return 75
    if (totalExperience >= 1) return 60
    return 40
  }
  
  private calculateSkillScore(
    resume: ResumeData,
    matchedKeywords: string[]
  ): number {
    const skillNames = resume.skills.map(s => s.name.toLowerCase())
    const matchedSkills = matchedKeywords.filter(k => 
      skillNames.some(s => s.includes(k) || k.includes(s))
    )
    
    const ratio = matchedSkills.length / Math.max(skillNames.length, 1)
    return Math.round(ratio * 100)
  }
}
