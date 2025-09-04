// packages/job-recommender/src/MatchingEngine.ts
export class MatchingEngine {
  async calculateMatchScore(resume: Resume, job: Job): Promise<MatchResult> {
    const scores = await Promise.all([
      this.skillMatching(resume.skills, job.requirements),
      this.experienceMatching(resume.experience, job.experience),
      this.locationMatching(resume.location, job.location),
      this.salaryMatching(resume.expectedSalary, job.salaryRange),
      this.semanticMatching(resume.embedding, job.embedding)
    ])
    
    // 加权计算总分
    const weights = [0.3, 0.25, 0.15, 0.1, 0.2]
    const totalScore = scores.reduce((sum, score, index) => 
      sum + score * weights[index], 0
    )
    
    return {
      totalScore,
      breakdown: {
        skills: scores[0],
        experience: scores[1],
        location: scores[2],
        salary: scores[3],
        semantic: scores[4]
      },
      recommendations: this.generateRecommendations(scores)
    }
  }
}
