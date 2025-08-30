export class LocalStorage {
  private prefix: string
  
  constructor(prefix: string = 'ai-resume-agent') {
    this.prefix = prefix
  }
  
  private getKey(key: string): string {
    return `${this.prefix}:${key}`
  }
  
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.getKey(key))
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('LocalStorage get error:', error)
      return null
    }
  }
  
  async set(key: string, value: any): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value))
    } catch (error) {
      console.error('LocalStorage set error:', error)
    }
  }
  
  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key))
    } catch (error) {
      console.error('LocalStorage remove error:', error)
    }
  }
  
  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('LocalStorage clear error:', error)
    }
  }
  
  async getAll(): Promise<Record<string, any>> {
    const result: Record<string, any> = {}
    const keys = Object.keys(localStorage)
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const cleanKey = key.replace(`${this.prefix}:`, '')
        try {
          result[cleanKey] = JSON.parse(localStorage.getItem(key) || '{}')
        } catch (error) {
          console.error(`Error parsing ${key}:`, error)
        }
      }
    })
    
    return result
  }
}
