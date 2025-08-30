import { Tool } from '../types'

export class HttpTool implements Tool {
  name = 'http_request'
  description = 'Make HTTP requests to external APIs'
  
  async execute(params: {
    url: string
    method?: string
    headers?: Record<string, string>
    body?: any
  }): Promise<any> {
    const { url, method = 'GET', headers = {}, body } = params
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      })
      
      const data = await response.json()
      
      return {
        status: response.status,
        data,
        headers: Object.fromEntries(response.headers.entries())
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Request failed',
        url,
        method
      }
    }
  }
}
