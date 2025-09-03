// apps/web/src/pages/CareerChatPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Bot, User, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const CareerChatPage: React.FC = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是你的职业发展顾问。我可以帮助你进行职业规划、简历优化、面试准备等。请问有什么可以帮助你的吗？',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // 模拟 AI 响应（实际应调用 API）
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getAIResponse(input),
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        setLoading(false)
      }, 1500)
    } catch (error) {
      toast.error('发送失败，请重试')
      setLoading(false)
    }
  }

  // 模拟 AI 响应逻辑
  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('简历')) {
      return '关于简历优化，我建议你：\n1. 使用量化的成果描述\n2. 突出与目标职位相关的经验\n3. 保持简洁，控制在1-2页\n4. 使用专业的格式和布局\n\n你想了解哪个方面的具体建议？'
    }
    
    if (lowerQuestion.includes('面试')) {
      return '面试准备的关键点：\n1. 研究目标公司和职位\n2. 准备STAR法则的案例故事\n3. 练习常见面试问题\n4. 准备好反问面试官的问题\n\n需要我帮你模拟面试吗？'
    }
    
    if (lowerQuestion.includes('职业规划') || lowerQuestion.includes('发展')) {
      return '职业规划是一个长期过程，建议你：\n1. 明确自己的兴趣和优势\n2. 设定短期和长期目标\n3. 持续学习和提升技能\n4. 建立行业人脉网络\n\n你目前处于职业生涯的哪个阶段？'
    }
    
    return '这是个很好的问题！让我为你提供一些建议。你能详细说明一下你的具体情况吗？比如你的背景、目标和当前面临的挑战。'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                AI 职业顾问
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* 聊天区域 */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-xl h-[calc(100vh-200px)] flex flex-col">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-2xl ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <div className="border-t p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="输入您的问题..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>发送</span>
              </button>
            </div>
            
            {/* 快捷问题 */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['如何优化简历？', '面试技巧', '职业规划建议', '薪资谈判'].map((question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerChatPage
