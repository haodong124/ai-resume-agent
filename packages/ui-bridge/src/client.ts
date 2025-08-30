import { AgentResponse } from './dto'
import { AppError, ErrorCode } from './errors'

export class APIClient {
  private baseURL: string
  
  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_URL || '/.netlify/functions'
  }
  
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<AgentResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new AppError(
          ErrorCode.BAD_REQUEST,
          error.message || 'Request failed',
          response.status,
          error
        )
      }
      
      const data = await response.json()
      return {
        success: true,
        data
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Unknown error',
        500
      )
    }
  }
  
  async post<T = any>(endpoint: string, body: any): Promise<AgentResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }
  
  async get<T = any>(endpoint: string): Promise<AgentResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET'
    })
  }
}
