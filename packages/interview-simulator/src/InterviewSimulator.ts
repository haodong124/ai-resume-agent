// packages/interview-simulator/src/InterviewSimulator.ts
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { supabase } from "../../shared/supabase"

export interface InterviewConfig {
  jobType: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  focusAreas: string[]
  duration: number // 分钟
}

export interface Question {
  id: string
  content: string
  type: 'technical' | 'behavioral' | 'situational'
  expectedPoints: string[]
  timeLimit: number
}

export interface Answer {
  questionId: string
  content: string
  audioUrl?: string
  submittedAt: Date
}

export interface Evaluation {
  score: number // 0-100
  strengths: string[]
  improvements: string[]
  feedback: string
  nextSteps: string[]
}

export class InterviewSimulator {
  private llm: ChatOpenAI
  private questionBank: Map<string, Question[]>

  constructor(apiKey: string) {
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7
    })

    this.initializeQuestionBank()
  }

  private initializeQuestionBank() {
    this.questionBank = new Map([
      ['frontend', [
        {
          id: 'fe_001',
          content: '请解释React的虚拟DOM是什么，以及它是如何工作的？',
          type: 'technical',
          expectedPoints: [
            '虚拟DOM是JS对象树',
            'diff算法优化性能',
            '批量更新减少重绘',
            '提高开发体验'
          ],
          timeLimit: 300
        },
        {
          id: 'fe_002',
          content: '描述一次你优化网站性能的经历，你是如何发现问题并解决的？',
          type: 'behavioral',
          expectedPoints: [
            '问题识别方法',
            '性能分析工具',
            '具体优化措施',
            '结果量化'
          ],
          timeLimit: 420
        }
      ]],
      ['backend', [
        {
          id: 'be_001',
          content: '设计一个高并发的订单系统，你会如何处理库存扣减的并发问题？',
          type: 'technical',
          expectedPoints: [
            '分布式锁',
            '乐观锁vs悲观锁',
            '消息队列',
            '数据库事务'
          ],
          timeLimit: 600
        }
      ]],
      ['fullstack', [
        {
          id: 'fs_001',
          content: '如果你需要设计一个类似Twitter的社交平台，你会如何设计整体架构？',
          type: 'technical',
          expectedPoints: [
            '微服务架构',
            '数据库设计',
            '缓存策略',
            'CDN和负载均衡'
          ],
          timeLimit: 900
        }
      ]]
    ])
  }

  async startSession(config: InterviewConfig, userId: string): Promise<string> {
    // 1. 生成面试题目
    const questions = this.selectQuestions(config)

    // 2. 创建面试会话
    const { data: session, error } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: userId,
        job_type: config.jobType,
        difficulty_level: config.difficulty,
        questions: questions,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return session.id
  }

  private selectQuestions(config: InterviewConfig): Question[] {
    const availableQuestions = this.questionBank.get(config.jobType) || []
    
    // 根据难度和关注领域筛选题目
    let filteredQuestions = availableQuestions
    
    // 简单的题目选择逻辑，可以更复杂
    const questionCount = config.difficulty === 'beginner' ? 3 : 
                         config.difficulty === 'intermediate' ? 5 : 7

    return filteredQuestions.slice(0, questionCount)
  }

  async getNextQuestion(sessionId: string): Promise<Question | null> {
    const { data: session, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error || !session) return null

    const questions = session.questions as Question[]
    const currentIndex = session.current_question - 1

    if (currentIndex >= questions.length) return null

    return questions[currentIndex]
  }

  async submitAnswer(sessionId: string, answer: Answer): Promise<Evaluation> {
    // 1. 获取问题信息
    const question = await this.getQuestionById(sessionId, answer.questionId)
    if (!question) throw new Error('Question not found')

    // 2. AI评估回答
    const evaluation = await this.evaluateAnswer(question, answer)

    // 3. 保存答案和评估
    await supabase
      .from('interview_answers')
      .insert({
        session_id: sessionId,
        question_id: answer.questionId,
        answer_content: answer.content,
        audio_url: answer.audioUrl,
        evaluation_score: evaluation.score,
        evaluation_feedback: evaluation.feedback,
        submitted_at: answer.submittedAt.toISOString()
      })

    // 4. 更新会话进度
    await this.updateSessionProgress(sessionId)

    return evaluation
  }

  private async evaluateAnswer(question: Question, answer: Answer): Promise<Evaluation> {
    const prompt = PromptTemplate.fromTemplate(`
你是一位资深的技术面试官。请评估候选人对以下问题的回答：

问题：{question}
问题类型：{questionType}
期望要点：{expectedPoints}

候选人回答：{answer}

请从以下维度评分（0-100分）：
1. 内容准确性（30%）
2. 逻辑清晰度（25%）
3. 深度和广度（25%）
4. 表达能力（20%）

请以JSON格式返回评估结果：
{{
  "score": 分数,
  "strengths": ["优点1", "优点2"],
  "improvements": ["改进点1", "改进点2"],
  "feedback": "详细反馈",
  "nextSteps": ["建议1", "建议2"]
}}
    `)

    const formattedPrompt = await prompt.format({
      question: question.content,
      questionType: question.type,
      expectedPoints: question.expectedPoints.join(', '),
      answer: answer.content
    })

    const response = await this.llm.invoke(formattedPrompt)

    try {
      return JSON.parse(response.content as string)
    } catch (error) {
      // 如果解析失败，返回默认评估
      return {
        score: 60,
        strengths: ['回答了问题'],
        improvements: ['可以更详细地回答'],
        feedback: '回答基本正确，但可以更详细一些。',
        nextSteps: ['复习相关概念', '练习更多案例']
      }
    }
  }

  async getSessionSummary(sessionId: string): Promise<any> {
    // 获取完整的面试结果和建议
    const { data: session } = await supabase
      .from('interview_sessions')
      .select(`
        *,
        interview_answers (*)
      `)
      .eq('id', sessionId)
      .single()

    if (!session) return null

    const answers = session.interview_answers
    const avgScore = answers.reduce((sum: number, ans: any) => sum + ans.evaluation_score, 0) / answers.length

    return {
      sessionId,
      totalQuestions: answers.length,
      averageScore: Math.round(avgScore),
      duration: this.calculateDuration(session.created_at, session.completed_at),
      breakdown: {
        technical: this.getScoreByType(answers, 'technical'),
        behavioral: this.getScoreByType(answers, 'behavioral'),
        situational: this.getScoreByType(answers, 'situational')
      },
      overallFeedback: this.generateOverallFeedback(avgScore),
      improvementPlan: this.generateImprovementPlan(answers)
    }
  }
}
