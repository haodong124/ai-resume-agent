// apps/web/src/components/InterviewSimulator.tsx
import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Mic, MicOff, Clock, CheckCircle } from 'lucide-react'

interface Question {
  id: string
  content: string
  type: 'technical' | 'behavioral' | 'situational'
  timeLimit: number
  expectedPoints: string[]
}

interface Answer {
  questionId: string
  content: string
  audioUrl?: string
  submittedAt: Date
}

interface Evaluation {
  score: number
  strengths: string[]
  improvements: string[]
  feedback: string
  nextSteps: string[]
}

const InterviewSimulator: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(5)
  const [isCompleted, setIsCompleted] = useState(false)
  const [config, setConfig] = useState({
    jobType: 'frontend',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced'
  })

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimeUp()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [timeLeft, isTimerActive])

  const startInterview = async () => {
    try {
      const response = await fetch('/.netlify/functions/interview-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_type: config.jobType,
          difficulty_level: config.difficulty
        })
      })

      const result = await response.json()
      if (result.success) {
        setSessionId(result.data.session_id)
        setTotalQuestions(result.data.total_questions)
        await loadNextQuestion(result.data.session_id)
      }
    } catch (error) {
      console.error('开始面试失败:', error)
    }
  }

  const loadNextQuestion = async (sessionId: string) => {
    try {
      const response = await fetch('/.netlify/functions/interview-next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      })

      const result = await response.json()
      if (result.success && result.data.question) {
        setCurrentQuestion(result.data.question)
        setTimeLeft(result.data.question.timeLimit)
        setIsTimerActive(true)
        setEvaluation(null)
        setAnswer('')
      } else if (result.data.completed) {
        setIsCompleted(true)
        setIsTimerActive(false)
      }
    } catch (error) {
      console.error('加载问题失败:', error)
    }
  }

  const submitAnswer = async () => {
    if (!sessionId || !currentQuestion || !answer.trim()) return

    setIsTimerActive(false)

    const answerData: Answer = {
      questionId: currentQuestion.id,
      content: answer,
      submittedAt: new Date()
    }

    try {
      const response = await fetch('/.netlify/functions/interview-submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          ...answerData
        })
      })

      const result = await response.json()
      if (result.success) {
        setEvaluation(result.data)
        setQuestionNumber(prev => prev + 1)
      }
    } catch (error) {
      console.error('提交答案失败:', error)
    }
  }

  const handleTimeUp = () => {
    setIsTimerActive(false)
    if (answer.trim()) {
      submitAnswer()
    } else {
      setEvaluation({
        score: 0,
        strengths: [],
        improvements: ['回答时间不足', '需要更好的时间管理'],
        feedback: '由于时间不足，未能完成回答。建议提前准备并练习控制回答时间。',
        nextSteps: ['练习在限定时间内组织答案', '准备核心要点']
      })
    }
  }

  const nextQuestion = () => {
    if (sessionId) {
      loadNextQuestion(sessionId)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        // 这里可以将音频上传到服务器或转换为文字
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('录音失败:', error)
      alert('无法访问麦克风，请检查权限设置')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 55) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getQuestionTypeColor = (type: string) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-800',
      behavioral: 'bg-green-100 text-green-800',
      situational: 'bg-purple-100 text-purple-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (!sessionId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">模拟面试设置</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                职位类型
              </label>
              <select
                value={config.jobType}
                onChange={(e) => setConfig({...config, jobType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="frontend">前端开发</option>
                <option value="backend">后端开发</option>
                <option value="fullstack">全栈开发</option>
                <option value="mobile">移动开发</option>
                <option value="devops">运维工程师</option>
                <option value="data">数据分析师</option>
                <option value="product">产品经理</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                难度等级
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'beginner', label: '初级' },
                  { value: 'intermediate', label: '中级' },
                  { value: 'advanced', label: '高级' }
                ].map((level) => (
                  <label key={level.value} className="flex items-center">
                    <input
                      type="radio"
                      value={level.value}
                      checked={config.difficulty === level.value}
                      onChange={(e) => setConfig({...config, difficulty: e.target.value as any})}
                      className="mr-2"
                    />
                    {level.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">面试说明:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 总共{totalQuestions}道题目，包含技术和行为问题</li>
                <li>• 每题有时间限制，请合理安排回答时间</li>
                <li>• 支持文字和语音回答（可选）</li>
                <li>• 完成后会提供详细的评估报告</li>
              </ul>
            </div>

            <button
              onClick={startInterview}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              开始面试
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">面试完成！</h2>
          <p className="text-gray-600 mb-6">
            恭喜您完成了模拟面试，正在生成详细的评估报告...
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            开始新的面试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {currentQuestion && (
        <div className="bg-white rounded-lg shadow-lg">
          {/* 进度条 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                问题 {questionNumber} / {totalQuestions}
              </span>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className={`text-sm font-mono ${timeLeft <= 60 ? 'text-red-600' : 'text-gray-600'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(questionNumber - 1) / totalQuestions * 100}%` }}
              />
            </div>
          </div>

          {/* 问题内容 */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(currentQuestion.type)}`}>
                {currentQuestion.type === 'technical' ? '技术问题' :
                 currentQuestion.type === 'behavioral' ? '行为问题' : '情境问题'}
              </span>
            </div>

            <h3 className="text-lg font-semibold mb-6">
              {currentQuestion.content}
            </h3>

            {/* 回答区域 */}
            <div className="space-y-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="请输入您的回答..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={!isTimerActive}
              />

              {/* 录音控制 */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isRecording 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={!isTimerActive}
                >
                  {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isRecording ? '停止录音' : '开始录音'}
                </button>
                
                <span className="text-sm text-gray-500">
                  {isRecording && (
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      正在录音...
                    </span>
                  )}
                </span>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3">
                {!evaluation ? (
                  <button
                    onClick={submitAnswer}
                    disabled={!answer.trim() || !isTimerActive}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    提交回答
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    下一题
                  </button>
                )}
              </div>
          </div>

          {/* 评估结果 */}
          {evaluation && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <h4 className="text-lg font-semibold mb-4">回答评估</h4>
              
              {/* 分数 */}
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700 mr-3">总分:</span>
                <span className={`text-2xl font-bold ${getScoreColor(evaluation.score)}`}>
                  {evaluation.score}
                </span>
                <span className="text-gray-500 ml-1">/100</span>
              </div>

              {/* 详细反馈 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* 优点 */}
                <div>
                  <h5 className="font-medium text-green-700 mb-2">优点</h5>
                  <ul className="text-sm space-y-1">
                    {evaluation.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 改进点 */}
                <div>
                  <h5 className="font-medium text-orange-700 mb-2">改进建议</h5>
                  <ul className="text-sm space-y-1">
                    {evaluation.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-4 h-4 border-2 border-orange-500 rounded-full mr-2 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 详细反馈 */}
              <div className="bg-white p-4 rounded-lg mb-4">
                <h5 className="font-medium mb-2">详细反馈</h5>
                <p className="text-sm text-gray-700">{evaluation.feedback}</p>
              </div>

              {/* 下一步建议 */}
              <div>
                <h5 className="font-medium mb-2">下一步建议</h5>
                <ul className="text-sm space-y-1">
                  {evaluation.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default InterviewSimulator
