// packages/agent-core/src/ResumeAgent.ts
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StructuredOutputParser } from "langchain/output_parsers"
import { z } from "zod"

export class ResumeAgent {
  private llm: ChatOpenAI
  private outputParser: StructuredOutputParser<any>

  constructor(apiKey: string) {
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.3
    })

    // 定义输出结构
    this.outputParser = StructuredOutputParser.fromZodSchema(
      z.object({
        optimizedContent: z.string().describe("优化后的内容"),
        improvements: z.array(z.string()).describe("改进建议"),
        score: z.number().describe("内容质量评分(1-10)"),
        keywords: z.array(z.string()).describe("关键词建议")
      })
    )
  }

  async optimizeResumeSection(
    sectionType: string,
    content: string,
    targetJob?: string
  ) {
    const prompt = PromptTemplate.fromTemplate(`
你是一位资深HR和简历专家。请优化以下简历{sectionType}部分的内容。

当前内容：
{content}

目标职位：{targetJob}

请提供：
1. 优化后的内容
2. 具体的改进建议
3. 内容质量评分(1-10)
4. 相关关键词建议

{format_instructions}
    `)

    const formattedPrompt = await prompt.format({
      sectionType,
      content,
      targetJob: targetJob || "通用职位",
      format_instructions: this.outputParser.getFormatInstructions()
    })

    const response = await this.llm.invoke(formattedPrompt)
    return await this.outputParser.parse(response.content as string)
  }

  async generatePersonalSummary(resumeData: any) {
    const prompt = PromptTemplate.fromTemplate(`
基于以下简历信息，生成一个专业的个人简介：

工作经历：{experience}
技能：{skills}
教育背景：{education}

要求：
- 3-4句话，简洁有力
- 突出核心竞争力和成就
- 使用数据和具体成果
- 体现职业发展轨迹

{format_instructions}
    `)

    const experience = resumeData.experience?.map((exp: any) => 
      `${exp.position} at ${exp.company}`
    ).join(', ') || ''

    const skills = resumeData.skills?.join(', ') || ''
    const education = resumeData.education?.map((edu: any) => 
      `${edu.degree} in ${edu.major}`
    ).join(', ') || ''

    const formattedPrompt = await prompt.format({
      experience,
      skills,
      education,
      format_instructions: this.outputParser.getFormatInstructions()
    })

    const response = await this.llm.invoke(formattedPrompt)
    return await this.outputParser.parse(response.content as string)
  }
}
