// packages/ui-bridge/src/client.ts
import axios, { AxiosInstance } from 'axios'
import { z } from 'zod'

export class APIClient {
  private client: AxiosInstance
  
  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        
        const message = error.response?.data?.message || error.message || 'An error occurred'
        return Promise.reject(new Error(message))
      }
    )
  }
  
  async get<T>(url: string, params?: any): Promise<T> {
    return this.client.get(url, { params }) as Promise<T>
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data) as Promise<T>
  }
  
  async put<T>(url: string, data?: any): Promise<T> {
    return this.client.put(url, data) as Promise<T>
  }
  
  async delete<T>(url: string): Promise<T> {
    return this.client.delete(url) as Promise<T>
  }
  
  async upload(url: string, file: File, onProgress?: (percent: number) => void): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      },
    })
  }
}

// Export default instance
export const apiClient = new APIClient()
