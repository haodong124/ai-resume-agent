// packages/vector-store/src/VectorStore.ts
export class VectorStore {
  private client: any // Pinecone/Weaviate/pgvector

  async indexResume(resumeId: string, resumeData: ResumeData) {
    const embedding = await this.generateEmbedding(
      this.extractTextFromResume(resumeData)
    )
    
    await this.client.upsert({
      vectors: [{
        id: resumeId,
        values: embedding,
        metadata: {
          userId: resumeData.userId,
          skills: resumeData.skills,
          experience: resumeData.experience.length
        }
      }]
    })
  }

  async findSimilarJobs(resumeEmbedding: number[]): Promise<Job[]> {
    const results = await this.client.query({
      vector: resumeEmbedding,
      topK: 20,
      includeMetadata: true
    })
    
    return results.matches.map(match => ({
      ...match.metadata,
      similarity: match.score
    }))
  }
}
