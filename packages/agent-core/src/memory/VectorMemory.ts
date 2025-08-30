import { Memory } from '../types'

export class VectorMemory {
  private vectors: Map<string, { vector: number[], metadata: any }> = new Map()
  
  async embed(text: string): Promise<number[]> {
    // Mock embedding - in production, use OpenAI embeddings or similar
    const hash = this.simpleHash(text)
    const vector = new Array(1536).fill(0).map((_, i) => 
      Math.sin(hash * (i + 1)) * Math.cos(hash / (i + 1))
    )
    return vector
  }
  
  async store(id: string, text: string, metadata: any = {}): Promise<void> {
    const vector = await this.embed(text)
    this.vectors.set(id, { vector, metadata: { ...metadata, text } })
  }
  
  async search(query: string, topK: number = 5): Promise<Array<{ id: string, score: number, metadata: any }>> {
    const queryVector = await this.embed(query)
    const results: Array<{ id: string, score: number, metadata: any }> = []
    
    this.vectors.forEach((value, id) => {
      const score = this.cosineSimilarity(queryVector, value.vector)
      results.push({ id, score, metadata: value.metadata })
    })
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }
  
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
  
  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }
  
  clear(): void {
    this.vectors.clear()
  }
  
  size(): number {
    return this.vectors.size
  }
}
