import React, { useState } from 'react'
import { Send, Sparkles, Download, RefreshCw, User, Bot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function WorkspacePage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是你的AI简历助手。让我们开始创建你的完美简历吧！首先，请告诉我你的姓名和目标职位。'
    }
  ])
  const [input, setInput] = useState('')
  const [resumeData, setResumeData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    education: [],
    skills: []
  })

  const sendMessage = () => {
    if (!input.trim()) return

    // 添加用户消息
    const userMessage: Message = { role: 'user', content: input }
    setMessages([...messages, userMessage])

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: '理解了！让我帮你整理这些信息。你的工作经历听起来很棒，能详细说说你在上一份工作中的主要成就吗？'
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)

    setInput('')
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* 左侧：对话面板 */}
      <div className="w-1/2 bg-white border-r flex flex-col">
        {/* 头部 */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h1 className="font-semibold text-lg">AI简历助手</h1>
                <p className="text-sm text-blue-100">智能对话，轻松创建</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white text-sm"
            >
              退出
            </button>
          </div>
        </div>

        {/* 对话区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="输入你的信息..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-shadow"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 右侧：简历预览与分析 */}
      <div className="w-1/2 flex flex-col">
        {/* 工具栏 */}
        <div className="px-6 py-4 bg-white border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              重新生成
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出PDF
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">匹配度：</span>
            <span className="font-semibold text-green-600">85%</span>
          </div>
        </div>

        {/* 简历预览 */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">{resumeData.name || '你的姓名'}</h2>
            <p className="text-xl text-gray-600 mb-6">{resumeData.title || '目标职位'}</p>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-blue-600 mb-3">个人简介</h3>
                <p className="text-gray-700 leading-relaxed">
                  {resumeData.summary || '通过与AI对话，这里将生成你的专业简介...'}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-blue-600 mb-3">工作经历</h3>
                <div className="text-gray-700">
                  <p className="text-gray-400">AI正在根据你的对话生成工作经历...</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-blue-600 mb-3">技能专长</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    根据对话生成
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
