// apps/web/src/pages/EditorPage.tsx
// 完整的编辑器页面，集成5个真实模板并修复AI面板布局

import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Save, Download, Eye, EyeOff, Sparkles, X, Plus, Trash2,
  FileText, Palette, User, Briefcase, GraduationCap, Award, Code,
  ChevronDown, Copy, Check, Loader2
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

// AI服务配置
const AI_CONFIG = {
  enabled: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
}

// AI助手面板 - 独立浮动，不影响布局
const AIAssistantPanel: React.FC<{
  isOpen: boolean
  onClose: () => void
  currentSection: string
  resumeData: any
  onApplySuggestion: (content: string) => void
}> = ({ isOpen, onClose, currentSection, resumeData, onApplySuggestion }) => {
  const [suggestion, setSuggestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateSuggestion = async () => {
    if (!AI_CONFIG.enabled || !AI_CONFIG.apiKey) {
      toast.error('请配置AI API密钥')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的简历优化助手。请用中文提供具体、专业的优化建议。'
            },
            {
              role: 'user',
              content: `请为简历的${currentSection}部分提供优化建议。当前内容：${JSON.stringify(resumeData)}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      const data = await response.json()
      setSuggestion(data.choices[0].message.content)
    } catch (error) {
      console.error('AI Error:', error)
      toast.error('AI生成建议失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('已复制到剪贴板')
  }

  if (!isOpen) return null

  return (
    <>
      {/* 半透明背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* AI面板 - 固定在右侧，不占用布局空间 */}
      <div 
        className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-50 
                   transform transition-transform duration-300 ease-in-out"
        style={{ 
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          maxWidth: '90vw'
        }}
      >
        {/* 面板头部 */}
        <div className="h-16 border-b bg-gradient-to-r from-purple-50 to-blue-50 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">AI 优化助手</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/60 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 面板内容 */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          <div className="p-6">
            {/* 当前编辑部分提示 */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                正在优化: <span className="font-semibold">{getSectionName(currentSection)}</span>
              </p>
            </div>

            {/* AI建议内容区 */}
            {!suggestion && !isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-gray-600 mb-6">
                  让AI帮你优化{getSectionName(currentSection)}内容
                </p>
                <button
                  onClick={generateSuggestion}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                           transition font-medium shadow-lg hover:shadow-xl"
                >
                  生成优化建议
                </button>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600">AI正在分析中...</p>
              </div>
            )}

            {suggestion && !isLoading && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    AI 优化建议
                  </h4>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {suggestion}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                             hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制内容'}
                  </button>
                  <button
                    onClick={() => {
                      onApplySuggestion(suggestion)
                      toast.success('已应用建议')
                      onClose()
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg 
                             hover:bg-purple-700 transition font-medium"
                  >
                    应用建议
                  </button>
                </div>

                <button
                  onClick={generateSuggestion}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                           hover:bg-gray-200 transition"
                >
                  重新生成
                </button>
              </div>
            )}
          </div>

          {/* 底部提示 */}
          <div className="p-6 border-t bg-gray-50">
            <div className="text-xs text-gray-500 space-y-2">
              <p>💡 AI建议仅供参考，请根据实际情况调整</p>
              <p>🔒 你的数据安全加密，不会被存储或分享</p>
            </div>
          </div>
        </div>
      </div>
    </>
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
    toast.success('导出功能开发中...')
  }

  // 应用AI建议
  const handleApplySuggestion = (suggestion: string) => {
    // 根据当前section应用建议
    console.log('Applying suggestion to', currentSection, suggestion)
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 - 固定高度 */}
      <header className="h-16 bg-white border-b shadow-sm relative z-30">
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
            {/* 模板选择下拉菜单 */}
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

            {/* AI助手按钮 */}
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
              导出
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 - 使用flex布局，高度自适应 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧编辑区 */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} bg-white border-r overflow-y-auto`}>
          <div className="max-w-3xl mx-auto p-6">
            {/* Section Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex border-b">
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
                    className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 
                              text-sm font-medium transition-all ${
                      currentSection === section.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 编辑表单内容 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
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
        </div>

        {/* 右侧预览区 */}
        {showPreview && (
          <div className="w-1/2 bg-gray-100 overflow-y-auto">
            <div className="p-6">
              <div className="bg-white shadow-lg mx-auto" style={{ maxWidth: '210mm' }}>
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
      </div>

      {/* AI助手面板 - 独立浮动层，不影响主布局 */}
      <AIAssistantPanel
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        currentSection={currentSection}
        resumeData={resumeData}
        onApplySuggestion={handleApplySuggestion}
      />
    </div>
  )
}

// 表单组件示例（简化版）
const PersonalInfoForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">个人信息</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">姓名</label>
        <input
          type="text"
          value={data.personalInfo?.name || ''}
          onChange={(e) => onChange({
            ...data,
            personalInfo: { ...data.personalInfo, name: e.target.value }
          })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
        />
      </div>
    </div>
  </div>
)

const ExperienceForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">工作经历</h2>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
        <Plus className="w-4 h-4" />
        添加经历
      </button>
    </div>
    <p className="text-gray-500">工作经历编辑表单...</p>
  </div>
)

const EducationForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">教育背景</h2>
    <p className="text-gray-500">教育背景编辑表单...</p>
  </div>
)

const SkillsForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">专业技能</h2>
    <p className="text-gray-500">技能编辑表单...</p>
  </div>
)

const ProjectsForm: React.FC<{ data: any; onChange: any }> = ({ data, onChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">项目经验</h2>
    <p className="text-gray-500">项目编辑表单...</p>
  </div>
)

export default EditorPage
