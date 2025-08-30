import OpenAI from 'openai'
import { z } from 'zod'
import pRetry from 'p-retry'

export interface LLMConfig {
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
  timeout?: number
}

export class OpenAIClient {
  private client: OpenAI
  private config: LLMConfig
  
  constructor(config: LLMConfig) {
    this.config = {
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 2000,
      timeout: 30000,
      ...config
    }
    
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    })
  }
  
  async complete(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: Partial<LLMConfig>
  ): Promise<string> {
    const completion = await pRetry(
      async () => {
        const response = await this.client.chat.completions.create({
          model: options?.model || this.config.model!,
          messages,
          temperature: options?.temperature || this.config.temperature,
          max_tokens: options?.maxTokens || this.config.maxTokens,
        })
        
        return response.choices[0]?.message?.content || ''
      },
      {
        retries: 3,
        onFailedAttempt: (error) => {
          console.warn(`OpenAI API attempt ${error.attemptNumber} failed:`, error.message)
        },
      }
    )
    
    return completion
  }
  
  async generateJSON<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    systemPrompt?: string
  ): Promise<T> {
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt || 'You are a helpful assistant that returns valid JSON.',
      },
      {
        role: 'user' as const,
        content: `${prompt}\n\nReturn a valid JSON object that matches this schema:\n${JSON.stringify(schema._def, null, 2)}`,
      },
    ]
    
    const response = await this.complete(messages, {
      temperature: 0.3,
    })
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    return schema.parse(parsed)
  }
  
  async stream(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const stream = await this.client.chat.completions.create({
      model: this.config.model!,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: true,
    })
    
    let fullResponse = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      fullResponse += content
      onChunk(content)
    }
    
    return fullResponse
  }
}
