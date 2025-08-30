import Anthropic from '@anthropic-ai/sdk'

export interface LLMConfig {
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export class AnthropicClient {
  private client: Anthropic
  private config: LLMConfig
  
  constructor(config: LLMConfig) {
    this.config = {
      model: 'claude-3-opus-20240229',
      temperature: 0.7,
      maxTokens: 2000,
      ...config
    }
    
    this.client = new Anthropic({
      apiKey: this.config.apiKey,
    })
  }
  
  async complete(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: Partial<LLMConfig>
  ): Promise<string> {
    // Convert messages format for Anthropic
    const systemMessage = messages.find(m => m.role === 'system')?.content || ''
    const anthropicMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    
    const response = await this.client.messages.create({
      model: options?.model || this.config.model!,
      system: systemMessage,
      messages: anthropicMessages,
      max_tokens: options?.maxTokens || this.config.maxTokens!,
      temperature: options?.temperature || this.config.temperature,
    })
    
    return response.content[0].type === 'text' 
      ? response.content[0].text 
      : ''
  }
  
  async generateJSON(prompt: string, schema: any, systemPrompt?: string): Promise<any> {
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt || 'Return valid JSON only.',
      },
      {
        role: 'user' as const,
        content: `${prompt}\n\nReturn JSON matching this structure:\n${JSON.stringify(schema, null, 2)}`,
      },
    ]
    
    const response = await this.complete(messages, {
      temperature: 0.3,
    })
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }
    
    return JSON.parse(jsonMatch[0])
  }
}
