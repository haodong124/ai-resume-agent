import { AgentCore } from '@ai-resume-agent/agent-core'

interface ExtractedKeywords {
  technical: string[]
  soft: string[]
  tools: string[]
  certifications: string[]
  industry: string[]
}

export class KeywordExtractor {
  constructor(private agent: AgentCore) {}
  
  async extractFromJobDescription(jobDescription: string): Promise<ExtractedKeywords> {
    const prompt = `
      Extract keywords from this job description.
      Group them into categories:
      - Technical Skills (programming languages, frameworks)
      - Soft Skills (communication, leadership)
      - Tools (software, platforms)
      - Certifications (required certificates)
      - Industry Terms (domain-specific terms)
      
      Job Description:
      ${jobDescription}
      
      Return as JSON with arrays for each category.
    `
    
    const result = await this.agent.process('extract_keywords', {
      text: jobDescription,
      type: 'job_description',
      prompt
    })
    
    return this.parseKeywords(result)
  }
  
  async extractFromResume(resumeText: string): Promise<ExtractedKeywords> {
    const prompt = `
      Extract keywords from this resume.
      Identify:
      - Technical skills mentioned
      - Soft skills demonstrated
      - Tools and software used
      - Certifications listed
      - Industry-specific terms
      
      Resume:
      ${resumeText}
      
      Return categorized keywords as JSON.
    `
    
    const result = await this.agent.process('extract_keywords', {
      text: resumeText,
      type: 'resume',
      prompt
    })
    
    return this.parseKeywords(result)
  }
  
  async compareKeywords(
    jobKeywords: ExtractedKeywords,
    resumeKeywords: ExtractedKeywords
  ): Promise<{
    matched: string[]
    missing: string[]
    extra: string[]
    matchRate: number
  }> {
    const jobSet = new Set(this.flattenKeywords(jobKeywords))
    const resumeSet = new Set(this.flattenKeywords(resumeKeywords))
    
    const matched = Array.from(jobSet).filter(k => resumeSet.has(k))
    const missing = Array.from(jobSet).filter(k => !resumeSet.has(k))
    const extra = Array.from(resumeSet).filter(k => !jobSet.has(k))
    
    const matchRate = jobSet.size > 0 
      ? (matched.length / jobSet.size) * 100 
      : 0
    
    return {
      matched,
      missing,
      extra,
      matchRate: Math.round(matchRate)
    }
  }
  
  async suggestKeywords(
    currentKeywords: string[],
    targetRole: string
  ): Promise<string[]> {
    const prompt = `
      Based on the target role "${targetRole}" and current keywords,
      suggest 10-15 additional relevant keywords that would strengthen the resume.
      
      Current keywords: ${currentKeywords.join(', ')}
      
      Focus on:
      - Industry-standard terms
      - Trending technologies
      - Essential skills for the role
      - ATS-friendly keywords
      
      Return as a simple array of strings.
    `
    
    const result = await this.agent.process('suggest_keywords', {
      current: currentKeywords,
      role: targetRole,
      prompt
    })
    
    return this.parseStringArray(result)
  }
  
  private parseKeywords(result: any): ExtractedKeywords {
    try {
      if (result.results && result.results.length > 0) {
        const data = result.results[0]
        
        if (typeof data === 'string') {
          const parsed = JSON.parse(data)
          return {
            technical: parsed.technical || [],
            soft: parsed.soft || [],
            tools: parsed.tools || [],
            certifications: parsed.certifications || [],
            industry: parsed.industry || []
          }
        }
        
        return {
          technical: data.technical || [],
          soft: data.soft || [],
          tools: data.tools || [],
          certifications: data.certifications || [],
          industry: data.industry || []
        }
      }
    } catch (error) {
      console.error('Failed to parse keywords:', error)
    }
    
    return {
      technical: [],
      soft: [],
      tools: [],
      certifications: [],
      industry: []
    }
  }
  
  private parseStringArray(result: any): string[] {
    try {
      if (result.results && result.results.length > 0) {
        const data = result.results[0]
        
        if (typeof data === 'string') {
          return JSON.parse(data)
        }
        
        if (Array.isArray(data)) {
          return data
        }
        
        if (data.keywords) {
          return data.keywords
        }
      }
    } catch (error) {
      console.error('Failed to parse string array:', error)
    }
    
    return []
  }
  
  private flattenKeywords(keywords: ExtractedKeywords): string[] {
    return [
      ...keywords.technical,
      ...keywords.soft,
      ...keywords.tools,
      ...keywords.certifications,
      ...keywords.industry
    ]
  }
  
  // Utility method to clean and normalize keywords
  normalizeKeywords(keywords: string[]): string[] {
    return keywords
      .map(k => k.toLowerCase().trim())
      .filter(k => k.length > 0)
      .filter((k, i, arr) => arr.indexOf(k) === i) // Remove duplicates
  }
  
  // Extract keywords using simple pattern matching (fallback when AI is unavailable)
  extractKeywordsSimple(text: string): string[] {
    // Common technical keywords patterns
    const patterns = [
      /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|Go|Rust|Swift|Kotlin)\b/gi,
      /\b(React|Angular|Vue|Next\.js|Node\.js|Express|Django|Flask|Spring)\b/gi,
      /\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|Git|CI\/CD)\b/gi,
      /\b(MySQL|PostgreSQL|MongoDB|Redis|Elasticsearch)\b/gi,
      /\b(Machine Learning|AI|Deep Learning|NLP|Computer Vision)\b/gi,
      /\b(Agile|Scrum|DevOps|Microservices|REST|GraphQL)\b/gi,
    ]
    
    const keywords = new Set<string>()
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => keywords.add(match))
      }
    })
    
    return Array.from(keywords)
  }
}
