// packages/data-connectors/src/storage-local.ts

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

// Create a mock localStorage for Node.js environment
const mockStorage: Storage = {
  length: 0,
  clear: function(): void {
    for (const key in this) {
      if (this.hasOwnProperty(key) && key !== 'length' && key !== 'clear' && key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'key') {
        delete this[key as any]
      }
    }
    this.length = 0
  },
  getItem: function(key: string): string | null {
    return this.hasOwnProperty(key) ? String(this[key as any]) : null
  },
  key: function(index: number): string | null {
    const keys = Object.keys(this).filter(k => k !== 'length' && k !== 'clear' && k !== 'getItem' && k !== 'setItem' && k !== 'removeItem' && k !== 'key')
    return keys[index] || null
  },
  removeItem: function(key: string): void {
    if (this.hasOwnProperty(key)) {
      delete this[key as any]
      this.length--
    }
  },
  setItem: function(key: string, value: string): void {
    if (!this.hasOwnProperty(key)) {
      this.length++
    }
    this[key as any] = String(value)
  }
}

// Use real localStorage in browser, mock in Node.js
const storage = isBrowser ? window.localStorage : mockStorage

export class LocalStorage {
  private prefix: string
  
  constructor(prefix: string = 'app_') {
    this.prefix = prefix
  }
  
  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }
  
  get<T>(key: string): T | null {
    try {
      const item = storage.getItem(this.getKey(key))
      if (!item) return null
      
      const parsed = JSON.parse(item)
      
      // Check if item has expired
      if (parsed.expires && new Date(parsed.expires) < new Date()) {
        this.remove(key)
        return null
      }
      
      return parsed.value
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  }
  
  set<T>(key: string, value: T, expiresInMinutes?: number): void {
    try {
      const item: any = { value }
      
      if (expiresInMinutes) {
        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + expiresInMinutes)
        item.expires = expires.toISOString()
      }
      
      storage.setItem(this.getKey(key), JSON.stringify(item))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }
  
  remove(key: string): void {
    try {
      storage.removeItem(this.getKey(key))
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }
  
  clear(): void {
    try {
      const keys = this.getAllKeys()
      keys.forEach(key => storage.removeItem(key))
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
  
  private getAllKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key && key.startsWith(this.prefix)) {
        keys.push(key)
      }
    }
    return keys
  }
  
  getAll<T>(): Record<string, T> {
    const result: Record<string, T> = {}
    const keys = this.getAllKeys()
    
    keys.forEach(fullKey => {
      const key = fullKey.replace(this.prefix, '')
      const value = this.get<T>(key)
      if (value !== null) {
        result[key] = value
      }
    })
    
    return result
  }
}
