// packages/interview-agent/src/InterviewAgent.ts
export class InterviewAgent {
  private questionBank: QuestionBank
  private evaluator: ResponseEvaluator
  private voiceProcessor: VoiceProcessor

  async startInterview(jobType: string, level: string): Promise<InterviewSession> {
    const session = new InterviewSession({
      jobType,
      level,
      questions: await this.questionBank.generateQuestions(jobType, level)
    })
    
    return session
  }

  async evaluateResponse(
    question: Question, 
    response: string | AudioBuffer
  ): Promise<EvaluationResult> {
    // 处理语音输入
    const textResponse = await this.processInput(response)
    
    // 多维度评估
    const evaluation = await this.evaluator.evaluate(question, textResponse)
    
    return {
      score: evaluation.overallScore,
      feedback: {
        content: evaluation.contentScore,
        delivery: evaluation.deliveryScore,
        structure: evaluation.structureScore
      },
      improvements: evaluation.suggestions,
      nextQuestion: this.selectNextQuestion(evaluation)
    }
  }
}
