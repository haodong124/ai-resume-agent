// apps/web/src/pages/EditorPage.tsx
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Save, Download, Eye, EyeOff, Sparkles, Send, Plus, Trash2,
  User, Briefcase, GraduationCap, Award, Code, ChevronDown, Loader2,
  MessageSquare, Copy, Check, X
} from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import toast from 'react-hot-toast'

// 动态导入5个真实模板
const AmericanBusinessTemplate = lazy(() => import('../components/templates/AmericanBusinessTemplate'))
const CleanProfessionalTemplate = lazy(() => import('../components/templates/CleanProfessionalTemplate'))
const CreativeGoldenTemplate = lazy(() => import('../components/templates/CreativeGoldenTemplate'))
const EuropassStyleTemplate = lazy(() => import('../components/templates/EuropassStyleTemplate'))
const StandardTemplate = lazy(() => import('../components/templates/StandardTemplate'))

// 模板配置
const TEMPLATES = {
  standard: {
    name: '标准模板',
    component: StandardTemplate,
    description: '经典专业的简历格式'
  },
  american: {
    name: '美式商务',
    component: AmericanBusinessTemplate,
    description: '美国商务风格，简洁有力'
  },
  clean: {
    name: '清新专业',
    component: CleanProfessionalTemplate,
    description: '干净现代的设计风格'
  },
  creative: {
    name: '创意金色',
    component: CreativeGoldenTemplate,
    description: '富有创意的双栏设计'
  },
  europass: {
    name: '欧式风格',
    component: EuropassStyleTemplate,
    description: '欧洲标准简历格式'
  }
}

// AI配置
const AI_CONFIG = {
  enabled: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-3.5-turbo'
}

// AI系统提示词 - 参考Chinese Resume Builder的调教方式
const AI_SYSTEM_PROMPT = `你是一个专业的简历优化助手。你的任务是：

1. 直接提供优化后的内容，不要解释优化方法
2. 保持专业、简洁、有力的语言风格
3. 使用STAR法则描述工作经历（情境-任务-行动-结果）
4. 量化成果，使用具体数字和百分比
5. 使用强有力的动作动词
6. 确保内容ATS友好

回复规则：
- 如果用户提供工作经历，直接返回优化后的版本
- 如果用户要求生成内容，直接生成，不要说明
- 保持简洁，每条描述不超过2行
- 使用中文回复`

// 消息类型
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// 对话式AI助手面板
const AIAssistantPanel: React.FC<{
  currentSection: string
  resumeData: any
  onApplyContent: (section: string, content: any) => void
}> = ({ currentSection, resumeData, onApplyContent }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `你好！我是你的AI简历助手。我可以帮你：
• 优化工作经历描述
• 生成个人简介
• 改进项目描述
• 提炼技能亮点

直接告诉我你需要什么，我会给你优化后的内容。`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // 构建上下文
      const context = `
当前编辑部分：${getSectionName(currentSection)}
当前内容：${JSON.stringify(resumeData[currentSection] || resumeData.personalInfo || {})}

用户请求：${input}
      `

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPT },
            { role: 'user', content: context }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!response.ok) throw new Error('AI请求失败')

      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      // 如果响应包含具体内容，提供应用按钮
      if (aiResponse.includes('•') || aiResponse.includes('：')) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: '要应用这些内容到你的简历吗？',
            timestamp: new Date()
          }])
        }, 500)
      }
    } catch (error) {
      console.error('AI Error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，生成内容时出错了。请检查API配置或稍后重试。',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = (content: string) => {
    // 解析内容并应用到对应部分
    const lines = content.split('\n').filter(line => line.trim())
    
    if (currentSection === 'experience') {
      // 处理工作经历
      const achievements = lines
        .filter(line => line.includes('•'))
        .map(line => line.replace('•', '').trim())
      
      if (achievements.length > 0) {
        onApplyContent('experience', { achievements })
        toast.success('已应用到工作经历')
      }
    } else if (currentSection === 'personal') {
      // 处理个人简介
      const summary = lines.join(' ').trim()
      onApplyContent('personal', { summary })
      toast.success('已应用到个人简介')
    }
    // ... 其他部分的处理
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 头部 */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">AI简历助手</h3>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              
              {/* 如果是包含优化内容的AI回复，添加应用按钮 */}
              {message.role === 'assistant' && 
               (message.content.includes('•') || message.content.includes('：')) && 
               !message.content.includes('要应用') && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleApply(message.content)}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                  >
                    应用到简历
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(message.content)
                      toast.success('已复制')
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                  >
                    复制
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区 */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="描述你的工作经历，或让我帮你优化..."
            className="flex-1 px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500"
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* 快捷提示 */}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setInput('帮我优化这段工作经历：负责产品开发和团队管理')}
            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            优化工作经历
          </button>
          <button
            onClick={() => setInput('生成一段产品经理的个人简介')}
            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            生成个人简介
          </button>
          <button
            onClick={() => setInput('帮我写项目成就')}
            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            项目成就
          </button>
        </div>
      </div>
    </div>
  )
}

// 获取部分名称
const getSectionName = (section: string) => {
  const names: Record<string, string> = {
    personal: '个人信息',
    experience: '工作经历',
    education: '教育背景',
    skills: '专业技能',
    projects: '项目经验'
  }
  return names[section] || section
}

// 主编辑器页面
const EditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { resumeData, updateResumeData } = useResumeStore()
  const [selectedTemplate, setSelectedTemplate] = useState('standard')
  const [showPreview, setShowPreview] = useState(true)
  const [showAI, setShowAI] = useState(false)
  const [currentSection, setCurrentSection] = useState('personal')
  const [isSaving, setIsSaving] = useState(false)

  // 保存功能
  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      localStorage.setItem('selectedTemplate', selectedTemplate)
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('保存成功！')
    } catch (error) {
      toast.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  // 导出PDF
  const handleExport = async () => {
    const previewElement = document.getElementById('resume-preview')
    if (!previewElement) {
      toast.error('请先预览简历')
      return
    }

    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`resume-${Date.now()}.pdf`)
      
      toast.success('PDF导出成功！')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('导出失败，请重试')
    }
  }

  // 应用AI生成的内容
  const handleApplyContent = (section: string, content: any) => {
    const updatedData = { ...resumeData }
    
    if (section === 'personal' && content.summary) {
      updatedData.personalInfo = {
        ...updatedData.personalInfo,
        summary: content.summary
      }
    } else if (section === 'experience' && content.achievements) {
      // 应用到最新的工作经历
      if (updatedData.experience && updatedData.experience.length > 0) {
        updatedData.experience[0].achievements = content.achievements
      }
    }
    // ... 其他部分的处理
    
    updateResumeData(updatedData)
  }

  // 加载保存的数据
  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate')
    if (savedTemplate && TEMPLATES[savedTemplate as keyof typeof TEMPLATES]) {
      setSelectedTemplate(savedTemplate)
    }
  }, [])

  const SelectedTemplate = TEMPLATES[selectedTemplate as keyof typeof TEMPLATES].component

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="h-16 bg-white border-b shadow-sm z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">简历编辑器</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* 模板选择 */}
            <div className="relative">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-gray-50 border rounded-lg 
                         cursor-pointer hover:bg-gray-100 transition text-sm"
              >
                {Object.entries(TEMPLATES).map(([key, template]) => (
                  <option key={key} value={key}>
                    {template.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* 预览切换 */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title={showPreview ? '隐藏预览' : '显示预览'}
            >
              {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {/* AI助手 */}
            <button
              onClick={() => setShowAI(!showAI)}
              className={`p-2 rounded-lg transition ${
                showAI ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
              }`}
              title="AI助手"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            {/* 操作按钮 */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              {isSaving ? '保存中...' : '保存'}
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 
                       transition flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              导出PDF
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧编辑区 */}
        <div className={`${showPreview ? (showAI ? 'w-1/3' : 'w-1/2') : 'flex-1'} flex flex-col bg-white border-r`}>
          {/* Section标签 */}
          <div className="flex border-b bg-gray-50">
            {[
              { id: 'personal', label: '个人信息', icon: User },
              { id: 'experience', label: '工作经历', icon: Briefcase },
              { id: 'education', label: '教育背景', icon: GraduationCap },
              { id: 'skills', label: '专业技能', icon: Award },
              { id: 'projects', label: '项目经验', icon: Code }
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex-1 px-3 py-3 flex items-center justify-center gap-1 
                          text-xs font-medium transition-all ${
                  currentSection === section.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            ))}
          </div>

          {/* 编辑表单内容 */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentSection === 'personal' && (
              <PersonalInfoForm data={resumeData} onChange={updateResumeData} />
            )}
            {currentSection === 'experience' && (
              <ExperienceForm data={resumeData} onChange={updateResumeData} />
            )}
            {currentSection === 'education' && (
              <EducationForm data={resumeData} onChange={updateResumeData} />
            )}
            {currentSection === 'skills' && (
              <SkillsForm data={resumeData} onChange={updateResumeData} />
            )}
            {currentSection === 'projects' && (
              <ProjectsForm data={resumeData} onChange={updateResumeData} />
            )}
          </div>
        </div>

        {/* 中间预览区 */}
        {showPreview && (
          <div className={`${showAI ? 'w-1/3' : 'w-1/2'} bg-gray-100 overflow-y-auto`}>
            <div className="p-4">
              <div id="resume-preview" className="bg-white shadow-lg mx-auto" style={{ maxWidth: '210mm' }}>
                <Suspense fallback={
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                }>
                  <SelectedTemplate resumeData={resumeData} isPreview={true} />
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {/* 右侧AI助手 */}
        {showAI && (
          <div className="w-1/3 border-l">
            <AIAssistantPanel
              currentSection={currentSection}
              resumeData={resumeData}
              onApplyContent={handleApplyContent}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// 表单组件
const PersonalInfoForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">个人信息</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">姓名 *</label>
        <input
          type="text"
          value={data.personalInfo?.name || ''}
          onChange={(e) => onChange({
            ...data,
            personalInfo: { ...data.personalInfo, name: e.target.value }
          })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="请输入姓名"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">职位</label>
        <input
          type="text"
          value={data.personalInfo?.title || ''}
          onChange={(e) => onChange({
            ...data,
            personalInfo: { ...data.personalInfo, title: e.target.value }
          })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="目标职位"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">邮箱 *</label>
        <input
          type="email"
          value={data.personalInfo?.email || ''}
          onChange={(e) => onChange({
            ...data,
            personalInfo: { ...data.personalInfo, email: e.target.value }
          })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="example@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">电话 *</label>
        <input
          type="tel"
          value={data.personalInfo?.phone || ''}
          onChange={(e) => onChange({
            ...data,
            personalInfo: { ...data.personalInfo, phone: e.target.value }
          })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="手机号码"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">所在地</label>
        <input
          type="text"
          value={data.personalInfo?.location || ''}
          onChange={(e) => onChange({
            ...data,
            personalInfo: { ...data.personalInfo, location: e.target.value }
          })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="城市"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">个人网站</label>
        <input
          type="url"
          value={data.personalInfo?.website || ''}
          onChange={(e) => onChange({
            ...data,
            personalInfo: { ...data.personalInfo, website: e.target.value }
          })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">个人简介</label>
      <textarea
        value={data.personalInfo?.summary || ''}
        onChange={(e) => onChange({
          ...data,
          personalInfo: { ...data.personalInfo, summary: e.target.value }
        })}
        rows={4}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="简要介绍你的职业背景和核心优势..."
      />
    </div>
  </div>
)

const ExperienceForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => {
  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      location: '',
      description: '',
      achievements: []
    }
    onChange({
      ...data,
      experience: [...(data.experience || []), newExp]
    })
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...(data.experience || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, experience: updated })
  }

  const removeExperience = (index: number) => {
    const updated = (data.experience || []).filter((_: any, i: number) => i !== index)
    onChange({ ...data, experience: updated })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">工作经历</h2>
        <button
          onClick={addExperience}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加经历
        </button>
      </div>

      {(data.experience || []).map((exp: any, index: number) => (
        <div key={exp.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium">经历 {index + 1}</h3>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={exp.company}
              onChange={(e) => updateExperience(index, 'company', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="公司名称"
            />
            <input
              type="text"
              value={exp.position}
              onChange={(e) => updateExperience(index, 'position', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="职位"
            />
            <input
              type="text"
              value={exp.duration}
              onChange={(e) => updateExperience(index, 'duration', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="时间段 (如: 2020.01 - 2023.12)"
            />
            <input
              type="text"
              value={exp.location}
              onChange={(e) => updateExperience(index, 'location', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="工作地点"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">工作描述</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(index, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="描述你的主要职责..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">主要成就</label>
            {(exp.achievements || []).map((achievement: string, achIndex: number) => (
              <div key={achIndex} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => {
                    const newAchievements = [...(exp.achievements || [])]
                    newAchievements[achIndex] = e.target.value
                    updateExperience(index, 'achievements', newAchievements)
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="描述一项成就..."
                />
                <button
                  onClick={() => {
                    const newAchievements = exp.achievements.filter((_: any, i: number) => i !== achIndex)
                    updateExperience(index, 'achievements', newAchievements)
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newAchievements = [...(exp.achievements || []), '']
                updateExperience(index, 'achievements', newAchievements)
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + 添加成就
            </button>
          </div>
        </div>
      ))}

      {(!data.experience || data.experience.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无工作经历，点击上方按钮添加</p>
        </div>
      )}
    </div>
  )
}

const EducationForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => {
  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      major: '',
      duration: '',
      location: '',
      gpa: '',
      description: ''
    }
    onChange({
      ...data,
      education: [...(data.education || []), newEdu]
    })
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...(data.education || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, education: updated })
  }

  const removeEducation = (index: number) => {
    const updated = (data.education || []).filter((_: any, i: number) => i !== index)
    onChange({ ...data, education: updated })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">教育背景</h2>
        <button
          onClick={addEducation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加教育
        </button>
      </div>

      {(data.education || []).map((edu: any, index: number) => (
        <div key={edu.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium">教育经历 {index + 1}</h3>
            <button
              onClick={() => removeEducation(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={edu.school}
              onChange={(e) => updateEducation(index, 'school', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="学校名称"
            />
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="学位 (如: 学士/硕士)"
            />
            <input
              type="text"
              value={edu.major}
              onChange={(e) => updateEducation(index, 'major', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="专业"
            />
            <input
              type="text"
              value={edu.duration}
              onChange={(e) => updateEducation(index, 'duration', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="时间段 (如: 2016 - 2020)"
            />
            <input
              type="text"
              value={edu.gpa}
              onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="GPA (可选)"
            />
            <input
              type="text"
              value={edu.location}
              onChange={(e) => updateEducation(index, 'location', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="所在地"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">补充说明 (可选)</label>
            <textarea
              value={edu.description}
              onChange={(e) => updateEducation(index, 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="如：主要课程、荣誉奖项等"
            />
          </div>
        </div>
      ))}

      {(!data.education || data.education.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无教育背景，点击上方按钮添加</p>
        </div>
      )}
    </div>
  )
}

const SkillsForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => {
  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      level: 'proficient',
      category: '专业技能',
      description: ''
    }
    onChange({
      ...data,
      skills: [...(data.skills || []), newSkill]
    })
  }

  const updateSkill = (index: number, field: string, value: any) => {
    const updated = [...(data.skills || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, skills: updated })
  }

  const removeSkill = (index: number) => {
    const updated = (data.skills || []).filter((_: any, i: number) => i !== index)
    onChange({ ...data, skills: updated })
  }

  const categories = ['专业技能', '软件工具', '语言能力', '管理能力', '其他技能']
  const levels = [
    { value: 'understand', label: '了解' },
    { value: 'proficient', label: '熟练' },
    { value: 'expert', label: '精通' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">专业技能</h2>
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加技能
        </button>
      </div>

      {(data.skills || []).map((skill: any, index: number) => (
        <div key={skill.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <select
              value={skill.category}
              onChange={(e) => updateSkill(index, 'category', e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={() => removeSkill(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(index, 'name', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="技能名称"
            />
            <select
              value={skill.level}
              onChange={(e) => updateSkill(index, 'level', e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              {levels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={skill.description}
              onChange={(e) => updateSkill(index, 'description', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="补充说明 (可选)"
            />
          </div>
        </div>
      ))}

      {(!data.skills || data.skills.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无技能信息，点击上方按钮添加</p>
        </div>
      )}
    </div>
  )
}

const ProjectsForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => {
  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      role: '',
      duration: '',
      description: '',
      technologies: '',
      link: ''
    }
    onChange({
      ...data,
      projects: [...(data.projects || []), newProject]
    })
  }

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...(data.projects || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, projects: updated })
  }

  const removeProject = (index: number) => {
    const updated = (data.projects || []).filter((_: any, i: number) => i !== index)
    onChange({ ...data, projects: updated })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">项目经验</h2>
        <button
          onClick={addProject}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加项目
        </button>
      </div>

      {(data.projects || []).map((project: any, index: number) => (
        <div key={project.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium">项目 {index + 1}</h3>
            <button
              onClick={() => removeProject(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateProject(index, 'name', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="项目名称"
            />
            <input
              type="text"
              value={project.role}
              onChange={(e) => updateProject(index, 'role', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="担任角色"
            />
            <input
              type="text"
              value={project.duration}
              onChange={(e) => updateProject(index, 'duration', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="项目时间"
            />
            <input
              type="url"
              value={project.link}
              onChange={(e) => updateProject(index, 'link', e.target.value)}
              className="px-3 py-2 border rounded-lg"
              placeholder="项目链接 (可选)"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">项目描述</label>
            <textarea
              value={project.description}
              onChange={(e) => updateProject(index, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="描述项目背景、你的贡献和成果..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">技术栈</label>
            <input
              type="text"
              value={project.technologies}
              onChange={(e) => updateProject(index, 'technologies', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="如: React, Node.js, MongoDB"
            />
          </div>
        </div>
      ))}

      {(!data.projects || data.projects.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Code className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无项目经验，点击上方按钮添加</p>
        </div>
      )}
    </div>
  )
}

export default EditorPage
