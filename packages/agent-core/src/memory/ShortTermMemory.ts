import { Memory } from '../types'

export class ShortTermMemory {
  private memories: Memory[] = []
  private maxSize: number = 100
  
  add(content: any): void {
    const memory: Memory = {
      id: this.generateId(),
      timestamp: new Date(),
      content,
      type: 'short'
    }
    
    this.memories.push(memory)
    
    // Maintain size limit
    if (this.memories.length > this.maxSize) {
      this.memories.shift()
    }
  }
  
  get(id: string): Memory | undefined {
    return this.memories.find(m => m.id === id)
  }
  
  getRecent(count: number = 10): Memory[] {
    return this.memories.slice(-count)
  }
  
  getAll(): Memory[] {
    return [...this.memories]
  }
  
  clear(): void {
    this.memories = []
  }
  
  search(query: string): Memory[] {
    return this.memories.filter(m => 
      JSON.stringify(m.content).toLowerCase().includes(query.toLowerCase())
    )
  }
  
  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
