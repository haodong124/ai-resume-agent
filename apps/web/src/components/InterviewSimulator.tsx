// apps/web/src/components/InterviewSimulator.tsx
import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MessageCircle, 
  Clock, 
  Award,
  Mic,
  MicOff,
  ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Question {
  id: string
  text: string
  category: 'behavioral' | 'technical' | 'situational'
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
}

interface Answer {
  questionId: string
  content: string
  timeUsed: number
  score?: number
  feedback?: string
}

interface InterviewSession {
  id: string
  jobType: string
  difficulty: string
  questions: Question[]
  answers: Answer[]
  currentQuestionIndex: number
  status: 'not-started' | 'in-progress' | 'completed'
  startTime?: Date
  endTime?: Date
}

export const InterviewSimulator: React.FC = () => {
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [loading, setLoading] = useState(false)

  const jobTypes = [
    { id: 'frontend', name: '前端开发', icon: '💻' },
    { id: 'backend', name: '后端开发', icon: '⚙️' },
    { id: 'fullstack', name: '全栈开发', icon: '🔄' },
    { id: 'product', name: '产品经理', icon: '📱' },
    { id: 'design', name: 'UI/UX设计', icon: '🎨' },
    { id: 'data', name: '数据分析', icon: '📊' }
  ]

  const difficulties = [
    { id: 'beginner', name: '初级', description: '适合应届生和初级职位' },
    { id: 'intermediate', name: '中级', description: '适合有1-3年经验' },
    { id: 'senior', name: '高级', description: '适合资深专业人士' }
  ]

  const startInterview = async (jobType: string, difficulty: string) => {
    setLoading(true)
    try {
      const response = await fetch('/.netlify/functions/interview-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_type: jobType, difficulty_level: difficulty })
      })

      const result = await response.json()
      
      if (result.success) {
        setSession({
          id: result.data.session_id,
          jobType,
          difficulty,
          questions: result.data.questions || generateMockQuestions(jobType, difficulty),
          answers: [],
          currentQuestionIndex: 0,
          status: 'in-progress',
          startTime: new Date()
        })
        toast.success('面试开始！')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Start interview error:', error)
      // 使用模拟数据
      setSession({
        id: 'mock-session-' + Date.now(),
        jobType,
        difficulty,
        questions: generateMockQuestions(jobType, difficulty),
        answers: [],
        currentQuestionIndex: 0,
        status: 'in-progress',
        startTime: new Date()
      })
      toast.success('模拟面试开始！')
    } finally {
      setLoading(false)
    }
  }

  const generateMockQuestions = (jobType: string, difficulty: string): Question[] => {
    const questions: Record<string, Question[]> = {
      frontend: [
        {
          id: '1',
          text: '请简单介绍一下自己，以及为什么想要应聘前端开发这个职位？',
          category: 'behavioral',
          difficulty: 'easy',
          timeLimit: 180
        },
        {
          id: '2', 
          text: '请解释一下JavaScript中的闭包概念，并举个实际应用的例子。',
          category: 'technical',
          difficulty: 'medium',
          timeLimit: 300
        },
        {
          id: '3',
          text: '如果你发现网站加载速度很慢，你会怎样排查和优化？',
          category: 'situational',
          difficulty: 'medium',
          timeLimit: 240
        }
      ],
      backend: [
        {
          id: '1',
          text: '请介绍一下自己的后端开发经验。',
          category: 'behavioral',
          difficulty: 'easy',
          timeLimit: 180
        },
        {
          id: '2',
          text: '解释一下RESTful API的设计原则。',
          category: 'technical',
          difficulty: 'medium',
          timeLimit: 300
        }
      ]
    }
    
    return questions[jobType] || questions.frontend
  }

  const submitAnswer = async () => {
    if (!session || !currentAnswer.trim()) return

    const answer: Answer = {
      questionId: session.questions[session.currentQuestionIndex].id,
      content: currentAnswer,
      timeUsed: session.questions[session.currentQuestionIndex].timeLimit - timeLeft
    }

    const updatedSession = {
      ...session,
      answers: [...session.answers, answer],
      currentQuestionIndex: session.currentQuestionIndex + 1
    }

    if (updatedSession.currentQuestionIndex >= session.questions.length) {
      updatedSession.status = 'completed'
      updatedSession.endTime = new Date()
      toast.success('面试完成！')
    }

    setSession(updatedSession)
    setCurrentAnswer('')
    setTimeLeft(0)
  }

  const resetInterview = () => {
    setSession(null)
    setCurrentAnswer('')
    setTimeLeft(0)
  }

  // 计时器
  useEffect(() => {
    if (session?.status === 'in-progress' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [session, timeLeft])

  // 开始新问题时重置计时器
  useEffect(() => {
    if (session?.status === 'in-progress') {
      const currentQuestion = session.questions[session.currentQuestionIndex]
      if (currentQuestion) {
        setTimeLeft(currentQuestion.timeLimit)
      }
    }
  }, [session?.currentQuestionIndex])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 如果没有开始面试，显示选择界面
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI模拟面试</h1>
          <p className="text-gray-600">选择职位类型和难度，开始你的面试练习</p>
        </div>

        <div className="space-y-8">
          {/* 职位类型选择 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">选择职位类型</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {jobTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {/* 临时存储选择 */}}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 难度选择 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">选择难度级别</h2>
            <div className="space-y-3">
              {difficulties.map((diff) => (
                <div
                  key={diff.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{diff.name}</div>
                      <div className="text-sm text-gray-600">{diff.description}</div>
                    </div>
                    <button
                      onClick={() => startInterview('frontend', diff.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? '准备中...' : '开始面试'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = session.questions[session.currentQuestionIndex]
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100

  // 面试进行中
  if (session.status === 'in-progress') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* 面试头部信息 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-semibold">模拟面试进行中</h1>
              <p className="text-gray-600">
                问题 {session.currentQuestionIndex + 1} / {session.questions.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className={timeLeft <= 30 ? 'text-red-600 font-medium' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              <button
                onClick={resetInterview}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重新开始
              </button>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 当前问题 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  currentQuestion.category === 'technical' ? 'bg-red-100 text-red-700' :
                  currentQuestion.category === 'behavioral' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {currentQuestion.category === 'technical' ? '技术问题' :
                   currentQuestion.category === 'behavioral' ? '行为问题' : '情景问题'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  currentQuestion.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {currentQuestion.difficulty === 'hard' ? '困难' :
                   currentQuestion.difficulty === 'medium' ? '中等' : '简单'}
                </span>
              </div>
              <p className="text-lg text-gray-900 leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>
          </div>
        </div>

        {/* 回答区域 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">您的回答</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-lg ${
                  isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}
                title={isRecording ? '停止录音' : '开始录音'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请在这里输入您的回答..."
          />
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              建议回答时间：{formatTime(currentQuestion.timeLimit)}
            </p>
            
            <button
              onClick={submitAnswer}
              disabled={!currentAnswer.trim()}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              下一题
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 面试完成
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">面试完成！</h1>
        <p className="text-gray-600">恭喜您完成了这次模拟面试</p>
      </div>

      {/* 面试总结 */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">面试总结</h2>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {session.questions.length}
            </div>
            <div className="text-sm text-gray-600">总题数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((session.answers.reduce((sum, a) => sum + (a.score || 75), 0) / session.answers.length))}%
            </div>
            <div className="text-sm text-gray-600">平均得分</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {session.endTime && session.startTime ? 
                Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000) : 0}
            </div>
            <div className="text-sm text-gray-600">用时(分钟)</div>
          </div>
        </div>
      </div>

      {/* 详细反馈 */}
      <div className="space-y-4">
        {session.questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold">问题 {index + 1}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                得分: {session.answers[index]?.score || 75}%
              </span>
            </div>
            <p className="text-gray-700 mb-3">{question.text}</p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">您的回答：</p>
              <p className="mt-1">{session.answers[index]?.content || '未回答'}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={resetInterview}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          开始新的面试
        </button>
      </div>
    </div>
  )
}

export default InterviewSimulator
