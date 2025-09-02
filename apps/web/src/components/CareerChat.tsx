// apps/web/src/components/CareerChat.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Lightbulb, CheckCircle, Loader2 } from 'lucide-react'
import type { ConversationContext } from '../types/resume'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  followUpQuestions?: string[]
  actionItems?: string[]
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
  const [context] = useState<ConversationContext>({
    userId: 'user-' + Math.random().toString(36).substr(2, 9)
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
      console.error('Career chat error:', error)
      
      // 模拟回复用于测试
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '感谢您的问题！基于我的职业指导经验，我建议您...',
        timestamp: new Date(),
        followUpQuestions: ['您还想了解什么其他方面？'],
        actionItems: ['完善简历内容', '准备面试问题']
      }
      setMessages(prev => [...prev, assistantMessage])
      
      toast.error('连接AI服务失败，显示模拟回复')
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
    <div className="max-w-4xl mx-auto h-full flex flex-col bg-white">
      {/* 头部 */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">AI职业顾问</h1>
            <p className="text-gray-600">专业的职业规划和求职指导</p>
          </div>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* 行动建议 */}
                  {message.actionItems && message.actionItems.length > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">行动建议</span>
                      </div>
                      <ul className="space-y-1">
                        {message.actionItems.map((item, index) => (
                          <li key={index} className="text-sm text-yellow-700 flex items-center">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* 后续问题建议 */}
                  {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        您还可以问我：
                      </p>
                      <div className="space-y-2">
                        {message.followUpQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => sendMessage(question)}
                            disabled={loading}
                            className="block text-left text-sm px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-600">AI正在思考...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            placeholder="输入您的职业问题..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* 快捷问题 */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => sendMessage('我该如何准备技术面试？')}
            disabled={loading}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            技术面试准备
          </button>
          <button
            onClick={() => sendMessage('如何提高简历通过率？')}
            disabled={loading}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            简历优化
          </button>
          <button
            onClick={() => sendMessage('职业转型有什么建议？')}
            disabled={loading}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            职业转型
          </button>
        </div>
      </div>
    </div>
  )
}

export default CareerChat
