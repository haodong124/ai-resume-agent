// packages/agent-core/src/llm/anthropic.ts
const Anthropic = require('@anthropic-ai/sdk')

export interface LLMConfig {
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export class AnthropicClient {
  private client: any
  private config: LLMConfig
  
  constructor(config: LLMConfig) {
    this.config = {
      model: 'claude-3-opus-20240229',
      temperature: 0.7,
      maxTokens: 2000,
      ...config
    }
    
    // Initialize Anthropic client
    const AnthropicClass = Anthropic.default || Anthropic
    this.client = new AnthropicClass({
      apiKey: this.config.apiKey,
    })
  }
  
  async complete(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: Partial<LLMConfig>
  ): Promise<string> {
    try {
      // Convert messages format for Anthropic
      const systemMessage = messages.find(m => m.role === 'system')?.content || ''
      const anthropicMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      
      // Call the create method on the messages property
      const messagesAPI = this.client.messages || this.client
      const response = await messagesAPI.create({
        model: options?.model || this.config.model!,
        system: systemMessage,
        messages: anthropicMessages,
        max_tokens: options?.maxTokens || this.config.maxTokens!,
        temperature: options?.temperature || this.config.temperature,
      })
      
      // Handle response content
      if (response && response.content && response.content.length > 0) {
        const firstContent = response.content[0]
        if (typeof firstContent === 'string') {
          return firstContent
        } else if (firstContent && typeof firstContent === 'object' && 'text' in firstContent) {
          return firstContent.text
        }
      }
      
      return ''
    } catch (error: any) {
      console.error('Anthropic API error:', error)
      throw new Error(`Failed to get response from Anthropic API: ${error.message}`)
    }
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
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }
    
    try {
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Failed to parse JSON:', jsonMatch[0])
      throw new Error('Invalid JSON in response')
    }
  }
}
