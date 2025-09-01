import OpenAI from 'openai'

export interface VectorSearchResult {
  id: string
  score: number
  metadata: Record<string, any>
}

export class VectorStore {
  private openai: OpenAI
  private vectorIndex: Map<string, number[]> = new Map()
  private metadata: Map<string, any> = new Map()

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey })
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
      })
      return response.data[0].embedding
    } catch (error) {
      console.error('生成向量失败:', error)
      // 返回随机向量作为降级处理
      return new Array(1536).fill(0).map(() => Math.random())
    }
  }

  async indexJob(job: JobDescription): Promise<void> {
    const text = `${job.title} ${job.description} ${job.requiredSkills.join(' ')}`
    const embedding = await this.generateEmbedding(text)
    
    this.vectorIndex.set(job.id, embedding)
    this.metadata.set(job.id, {
      title: job.title,
      company: job.company,
      location: job.location,
      requiredSkills: job.requiredSkills,
      salaryRange: job.salaryRange
    })
  }

  async similaritySearch(
    queryVector: number[], 
    options: { limit?: number; threshold?: number } = {}
  ): Promise<VectorSearchResult[]> {
    const { limit = 10, threshold = 0.7 } = options
    const results: VectorSearchResult[] = []

    for (const [id, vector] of this.vectorIndex) {
      const similarity = this.cosineSimilarity(queryVector, vector)
      if (similarity >= threshold) {
        results.push({
          id,
          score: similarity,
          metadata: this.metadata.get(id) || {}
        })
      }
    }

    // 按相似度排序并限制结果数量
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('向量维度不匹配')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}
