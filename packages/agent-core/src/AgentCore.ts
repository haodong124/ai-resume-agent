// packages/agent-core/src/AgentCore.ts
import { ChatOpenAI } from "langchain/chat_models/openai"
import { ConversationSummaryMemory } from "langchain/memory"
import { StructuredOutputParser } from "langchain/output_parsers"

export class AgentCore {
  private llm: ChatOpenAI
  private memory: ConversationSummaryMemory
  private vectorStore: SupabaseVectorStore

  constructor(config: AgentConfig) {
    this.llm = new ChatOpenAI({
      openAIApiKey: config.openaiApiKey,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.3
    })
    
    this.memory = new ConversationSummaryMemory({
      llm: this.llm,
      returnMessages: true
    })
    
    this.vectorStore = new SupabaseVectorStore(config.supabaseConfig)
  }

  async processWithRAG(query: string, context: any) {
    // 1. 从向量数据库检索相关信息
    const relevantDocs = await this.vectorStore.similaritySearch(query, 5)
    
    // 2. 构建增强提示
    const augmentedPrompt = this.buildRAGPrompt(query, relevantDocs, context)
    
    // 3. 生成结构化回答
    const response = await this.llm.call([
      { role: "system", content: augmentedPrompt }
    ])
    
    return this.parseStructuredResponse(response)
  }
}
