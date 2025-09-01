// apps/web/src/components/CareerChat.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Lightbulb, CheckCircle } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  followUpQuestions?: string[]
  actionItems?: string[]
}

interface CareerContext {
  userId: string
  jobTarget?: string
  currentRole?: string
  experienceLevel?: string
  industry?: string
}

export const CareerChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是你的AI职业顾问。我可以帮助你解答关于求职、面试准备、职业规划等问题。请告诉我你想了解什么？',
      timestamp: new Date(),
      followUpQuestions: [
        '我该如何准备技术面试？',
        '如何写一份吸引人的简历？',
        '怎样规划我的职业发展？'
      ]
    }
  ])
  
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<CareerContext>({
    userId: 'user-' + Math.random().toString(36).substr(2, 9)
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/.netlify/functions/career-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context
        })
      })

      const result = await response.json()
      
      if (result.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.data.answer,
          timestamp: new Date(),
          followUpQuestions: result.data.followUpQuestions,
          actionItems: result.data.actionItems
        }
        
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我暂时无法回答你的问题。请稍后再试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">AI职业顾问</h1>
            <p className="text-sm text-gray-600">专业的职业规划和求职指导</p>
          </div>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-3xl">
              <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gray-200'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                
                <div className={`rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* 行动项 */}
                  {message.actionItems && message.actionItems.length > 0 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">建议行动</span>
                      </div>
                      <ul className="space-y-1">
                        {message.actionItems.slice(0, 3).map((item, index) => (
                          <li key={index} className="text-sm text-green-700">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* 后续问题 */}
                  {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">你可能还想了解</span>
                      </div>
                      <div className="space-y-2">
                        {message.followUpQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => sendMessage(question)}
                            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
                            disabled={loading}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`text-xs text-gray-500 mt-1 ${
                message.role === 'user' ? 'text-right' : 'text-left ml-11'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-3xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                    <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm text-gray-600 ml-2">正在思考...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              disabled={loading}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </div>
    </div>
  )
}
