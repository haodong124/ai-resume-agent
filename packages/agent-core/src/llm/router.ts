import { OpenAIClient } from './openai'
import { AnthropicClient } from './anthropic'

export interface LLMConfig {
  llm: 'openai' | 'anthropic' | 'mock'
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export class LLMRouter {
  private client: any
  
  constructor(config: LLMConfig) {
    switch (config.llm) {
      case 'openai':
        this.client = new OpenAIClient({
          apiKey: config.apiKey!,
          model: config.model || 'gpt-4-turbo-preview',
          temperature: config.temperature,
          maxTokens: config.maxTokens
        })
        break
      case 'anthropic':
        this.client = new AnthropicClient({
          apiKey: config.apiKey!,
          model: config.model || 'claude-3-opus-20240229',
          temperature: config.temperature,
          maxTokens: config.maxTokens
        })
        break
      case 'mock':
        this.client = new MockLLMClient()
        break
      default:
        throw new Error(`Unsupported LLM: ${config.llm}`)
    }
  }
  
  async complete(messages: any[], options?: any): Promise<string> {
    return await this.client.complete(messages, options)
  }
  
  async generateJSON(prompt: string, schema: any, systemPrompt?: string): Promise<any> {
    if (this.client.generateJSON) {
      return await this.client.generateJSON(prompt, schema, systemPrompt)
    }
    
    // Fallback for clients without generateJSON
    const response = await this.complete([
      { role: 'system', content: systemPrompt || 'Return valid JSON' },
      { role: 'user', content: prompt }
    ])
    
    return JSON.parse(response)
  }
  
  async summarize(results: any[]): Promise<string> {
    const prompt = `Summarize these results concisely:\n${JSON.stringify(results, null, 2)}`
    return await this.complete([
      { role: 'system', content: 'You are a helpful assistant that summarizes information.' },
      { role: 'user', content: prompt }
    ])
  }
}

class MockLLMClient {
  async complete(messages: any[], options?: any): Promise<string> {
    return 'Mock response for: ' + messages[messages.length - 1].content
  }
  
  async generateJSON(prompt: string, schema: any): Promise<any> {
    return {
      success: true,
      message: 'Mock JSON response',
      data: {}
    }
  }
}
