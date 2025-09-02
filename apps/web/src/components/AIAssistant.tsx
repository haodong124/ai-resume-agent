// apps/web/src/components/AIAssistant.tsx
import React, { useState } from 'react'
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Lightbulb,
  Wand2,
  MessageSquare
} from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import toast from 'react-hot-toast'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'suggestion' | 'optimization' | 'question'
}

export const AIAssistant: React.FC = () => {
  const { resumeData, updateResumeData } = useResumeStore()
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: '你好！我是你的AI简历助手。我可以帮你优化简历内容、推荐技能、或回答求职相关问题。',
      timestamp: new Date(),
      type: 'question'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const quickActions = [
    {
      id: 'optimize-summary',
      label: '优化个人简介',
      icon: Wand2,
      action: () => optimizeSection('summary')
    },
    {
      id: 'enhance-experience',
      label: '增强工作描述',
      icon: Sparkles,
      action: () => optimizeSection('experience')
    },
    {
      id: 'suggest-skills',
      label: '推荐技能',
      icon: Lightbulb,
      action: () => suggestSkills()
    }
  ]

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || loading) return

    const userMessage: AIMessage = {
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // 模拟AI回复
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const responses = [
        '根据您的背景，我建议您在个人简介中突出您的技术专长和项目经验。',
        '您的工作经历很丰富，建议添加更多量化的成果数据来增强说服力。',
        '考虑添加一些当前热门的技术技能，如TypeScript、Docker等。',
        '您的教育背景很好，可以在简历中更突出相关课程和项目。'
      ]
      
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'suggestion'
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI assistant error:', error)
      toast.error('AI助手暂时不可用')
    } finally {
      setLoading(false)
    }
  }

  const optimizeSection = async (section: string) => {
    setLoading(true)
    try {
      if (section === 'summary' && resumeData.personalInfo.summary) {
        // 模拟优化个人简介
        const optimizedSummary = `具有${Math.floor(Math.random() * 5) + 2}年经验的${resumeData.personalInfo.title || '专业人士'}，专注于${resumeData.skills.slice(0, 3).map(s => s.name).join('、')}等技术领域。具备丰富的项目经验和团队协作能力。`
        
        updateResumeData({
          personalInfo: {
            ...resumeData.personalInfo,
            summary: optimizedSummary
          }
        })
        
        toast.success('个人简介已优化！')
      }
    } catch (error) {
      toast.error('优化失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const suggestSkills = () => {
    const suggestions = ['TypeScript', 'Docker', 'AWS', 'GraphQL', 'MongoDB']
    const message: AIMessage = {
      role: 'assistant',
      content: `基于您的背景，我推荐以下技能：${suggestions.join('、')}。这些技能在当前市场需求很高。`,
      timestamp: new Date(),
      type: 'suggestion'
    }
    setMessages(prev => [...prev, message])
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold">AI助手</h3>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={action.action}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <Icon className="w-4 h-4 text-purple-600" />
                {action.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div className={`inline-block max-w-xs p-3 rounded-lg text-sm ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="text-left">
            <div className="inline-block p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">AI思考中...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
            placeholder="问我任何关于简历的问题..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
