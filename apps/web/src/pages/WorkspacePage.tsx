import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Send, Sparkles, Download, FileText, Settings, 
  CheckCircle, Circle, MessageSquare, TrendingUp,
  User, Bot, ArrowLeft, Palette, RefreshCw, Zap
} from 'lucide-react'
import { callOpenAI } from '../lib/api'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ResumeSection {
  id: string
  name: string
  completed: boolean
  required: boolean
}

export default function WorkspacePage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 你好！我是你的AI职业顾问。让我们开始打造你的完美简历！\n\n首先，请告诉我你的姓名和想要应聘的职位是什么？'
    }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [resumeScore, setResumeScore] = useState(0)
  
  const [resumeData, setResumeData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  })

  const [sections] = useState<ResumeSection[]>([
    { id: 'basic', name: '基本信息', completed: false, required: true },
    { id: 'summary', name: '个人简介', completed: false, required: true },
    { id: 'experience', name: '工作经历', completed: false, required: true },
    { id: 'education', name: '教育背景', completed: false, required: true },
    { id: 'skills', name: '专业技能', completed: false, required: false },
    { id: 'projects', name: '项目经历', completed: false, required: false }
  ])

  const templates = [
    { id: 'modern', name: '现代简约', color: 'from-blue-500 to-cyan-500' },
    { id: 'classic', name: '经典专业', color: 'from-gray-600 to-gray-800' },
    { id: 'creative', name: '创意设计', color: 'from-purple-500 to-pink-500' }
  ]

  useEffect(() => {
    calculateScore()
  }, [resumeData])

  const calculateScore = () => {
    let score = 0
    if (resumeData.name) score += 10
    if (resumeData.title) score += 10
    if (resumeData.email) score += 10
    if (resumeData.phone) score += 10
    if (resumeData.location) score += 10
    if (resumeData.summary) score += 20
    if (resumeData.experience.length > 0) score += 15
    if (resumeData.education.length > 0) score += 10
    if (resumeData.skills.length > 0) score += 5
    setResumeScore(score)
  }

  const sendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    try {
      const systemPrompt = `你是一个专业的职业顾问和简历专家。根据用户提供的信息，帮助他们构建专业的简历。
用友好、专业的语气引导用户，每次只问一个问题，循序渐进地收集信息。
当用户提供信息时，提取关键信息并给出优化建议。`

      const aiResponse = await callOpenAI(input, systemPrompt)
      
      if (aiResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
        
        // 智能解析并更新简历数据
        parseAndUpdateResumeData(input)
      }
    } catch (error) {
      console.error('AI处理失败:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，我暂时无法处理。请继续告诉我你的信息。' 
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const parseAndUpdateResumeData = (text: string) => {
    // 简单的信息提取逻辑
    if (text.includes('@')) {
      setResumeData(prev => ({ ...prev, email: text.match(/[\w.-]+@[\w.-]+/)?.[0] || prev.email }))
    }
    if (text.match(/\d{11}|\d{3}-\d{4}-\d{4}/)) {
      setResumeData(prev => ({ ...prev, phone: text.match(/[\d-]+/)?.[0] || prev.phone }))
    }
  }

  const exportPDF = async () => {
    const element = document.getElementById('resume-preview')
    if (!element) return

    const canvas = await html2canvas(element, { scale: 2 })
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${resumeData.name || '简历'}_${new Date().toLocaleDateString()}.pdf`)
  }

  const getScoreColor = () => {
    if (resumeScore >= 80) return 'text-green-600'
    if (resumeScore >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">AI Resume Builder</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 模板切换 */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedTemplate === template.id 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>

          {/* 导出按钮 */}
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            导出PDF
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：AI对话面板 */}
        <div className="w-[450px] bg-white border-r flex flex-col">
          {/* 对话历史区 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="告诉我你的经历..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isProcessing}
              />
              <button
                onClick={sendMessage}
                disabled={isProcessing}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                💼 添加工作经历
              </button>
              <button className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                🎓 添加教育背景
              </button>
              <button className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                💡 获取建议
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：可视化面板 */}
        <div className="flex-1 flex">
          {/* 简历预览 */}
          <div className="flex-1 overflow-y-auto p-8">
            <div id="resume-preview" className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              {/* 根据选择的模板渲染不同样式 */}
              <div className={`${selectedTemplate === 'modern' ? 'border-l-4 border-blue-600 pl-6' : ''}`}>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {resumeData.name || '你的姓名'}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {resumeData.title || '目标职位'}
                </p>
                
                <div className="flex gap-4 text-sm text-gray-500 mb-6">
                  <span>{resumeData.email || 'email@example.com'}</span>
                  <span>{resumeData.phone || '138-0000-0000'}</span>
                  <span>{resumeData.location || '城市'}</span>
                </div>

                {resumeData.summary && (
                  <section className="mb-6">
                    <h2 className="text-lg font-semibold text-blue-600 mb-2">个人简介</h2>
                    <p className="text-gray-700">{resumeData.summary}</p>
                  </section>
                )}

                <section className="mb-6">
                  <h2 className="text-lg font-semibold text-blue-600 mb-2">工作经历</h2>
                  <p className="text-gray-400">通过对话添加你的工作经历...</p>
                </section>

                <section className="mb-6">
                  <h2 className="text-lg font-semibold text-blue-600 mb-2">教育背景</h2>
                  <p className="text-gray-400">通过对话添加你的教育背景...</p>
                </section>
              </div>
            </div>
          </div>

          {/* 右侧边栏：进度和分析 */}
          <div className="w-80 bg-white border-l p-6 overflow-y-auto">
            {/* 进度追踪 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                完成进度
              </h3>
              <div className="space-y-2">
                {sections.map(section => (
                  <div key={section.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {section.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-sm ${section.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {section.name}
                      </span>
                    </div>
                    {section.required && !section.completed && (
                      <span className="text-xs text-red-500">必填</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 智能评分 */}
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                AI智能评分
              </h3>
              <div className="text-center mb-3">
                <div className={`text-4xl font-bold ${getScoreColor()}`}>
                  {resumeScore}
                </div>
                <p className="text-sm text-gray-500">综合评分</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">完整度</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${resumeScore}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">专业度</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(resumeScore + 10, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI建议 */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                优化建议
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 添加3-5个量化的工作成就会让简历更有说服力
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📊 建议添加与目标职位相关的关键技能
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
