// apps/web/src/components/CareerChat.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Lightbulb, BookOpen, Target } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  resources?: string[]
  actionItems?: string[]
}

interface ChatResponse {
  response: string
  suggestions: string[]
  resources: string[]
}

const CareerChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '你好！我是你的AI职业顾问。我可以帮你解答关于面试准备、职业规划、技能提升等问题。有什么我可以帮助你的吗？',
      timestamp: new Date(),
      suggestions: [
        '如何准备技术面试？',
        '怎样提升简历竞争力？',
        '职业转型有什么建议？',
        '如何谈薪资？'
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userContext, setUserContext] = useState({
    currentRole: '',
    targetRole: '',
    experience: '',
    skills: []
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 加载用户上下文
    loadUserContext()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadUserContext = () => {
    // 从localStorage或API获取用户信息
    const resume = localStorage.getItem('currentResume')
    if (resume) {
      try {
        const resumeData = JSON.parse(resume)
        setUserContext({
          currentRole: resumeData.experience?.[0]?.position || '',
          targetRole: resumeData.targetPosition || '',
          experience: resumeData.experience?.length ? `${resumeData.experience.length}年经验` : '',
          skills: resumeData.skills || []
        })
      } catch (error) {
        console.error('解析简历数据失败:', error)
      }
    }
  }

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputMessage.trim()
    if (!messageContent) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/.netlify/functions/career-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          context: {
            user_id: localStorage.getItem('userId'),
            ...userContext
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.data.response.content,
          timestamp: new Date(),
          suggestions: result.data.response.follow_up_questions || [],
          resources: result.data.response.resources || [],
          actionItems: result.data.response.action_items || []
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(result.error || '请求失败')
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '抱歉，我暂时无法回答您的问题。请稍后再试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg shadow-lg">
      {/* 用户信息栏 */}
      {userContext.currentRole && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center text-sm text-blue-700">
            <User className="w-4 h-4 mr-2" />
            <span>{userContext.currentRole}</span>
            {userContext.targetRole && (
              <>
                <span className="mx-2">→</span>
                <span>{userContext.targetRole}</span>
              </>
            )}
            {userContext.experience && (
              <span className="ml-auto">{userContext.experience}</span>
            )}
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              {/* 头像 */}
              <div className={`flex items-center mb-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-500 text-white ml-2' : 'bg-gray-100 text-gray-600 mr-2'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {/* 消息内容 */}
              <div className={`p-4 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>

                {/* 建议问题 */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <Lightbulb className="w-4 h-4 mr-1" />
                      相关问题:
                    </div>
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="block w-full text-left px-3 py-2 text-sm bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* 学习资源 */}
                {message.resources && message.resources.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <BookOpen className="w-4 h-4 mr-1" />
                      推荐资源:
                    </div>
                    {message.resources.map((resource, index) => (
                      <div key={index} className="text-sm bg-white bg-opacity-20 rounded-lg p-2">
                        {resource}
                      </div>
                    ))}
                  </div>
                )}

                {/* 行动项 */}
                {message.actionItems && message.actionItems.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <Target className="w-4 h-4 mr-1" />
                      行动建议:
                    </div>
                    {message.actionItems.map((item, index) => (
                      <div key={index} className="text-sm bg-white bg-opacity-20 rounded-lg p-2">
                        • {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 p-4 bg-gray-100 rounded-2xl rounded-bl-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-500">AI正在思考...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* 快捷问题 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            '面试准备清单',
            '简历优化建议',
            '技能提升规划',
            '职业发展路径'
          ].map((quickQuestion) => (
            <button
              key={quickQuestion}
              onClick={() => handleSendMessage(quickQuestion)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              {quickQuestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CareerChat
