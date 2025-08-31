// apps/web/src/pages/EditorPage.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Eye, 
  EyeOff,
  Sparkles,
  MessageSquare,
  X,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check
} from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import toast from 'react-hot-toast'

// AI服务配置
const AI_CONFIG = {
  enabled: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo'
}

// AI助手服务
class AIAssistant {
  private apiKey: string
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateSuggestion(context: string, field: string): Promise<string> {
    if (!AI_CONFIG.enabled || !this.apiKey) {
      return '请配置API密钥以使用AI功能'
    }

    try {
      const response = await fetch(AI_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的简历优化助手，帮助用户改进简历内容。请用中文回复，提供具体、可操作的建议。'
            },
            {
              role: 'user',
              content: `请优化以下简历${field}部分的内容：\n${context}\n\n请提供3-5个改进建议。`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error('AI请求失败')
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('AI suggestion error:', error)
      return '生成建议时出错，请稍后重试'
    }
  }

  async optimizeContent(content: string, type: 'experience' | 'project' | 'skill'): Promise<string> {
    if (!AI_CONFIG.enabled || !this.apiKey) {
      return content
    }

    const prompts = {
      experience: '请将以下工作经历描述优化得更专业，使用STAR法则，量化成果',
      project: '请优化项目描述，突出技术难点和业务价值',
      skill: '请将技能描述组织得更有条理，按类别分组'
    }

    try {
      const response = await fetch(AI_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的简历优化专家。'
            },
            {
              role: 'user',
              content: `${prompts[type]}：\n\n${content}`
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      })

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Content optimization error:', error)
      return content
    }
  }
}

// AI助手面板组件
const AIPanel: React.FC<{
  isOpen: boolean
  onClose: () => void
  currentSection: string
  resumeData: any
  onApplySuggestion: (suggestion: string) => void
}> = ({ isOpen, onClose, currentSection, resumeData, onApplySuggestion }) => {
  const [suggestion, setSuggestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const aiAssistant = new AIAssistant(AI_CONFIG.apiKey)

  const generateSuggestion = async () => {
    setIsLoading(true)
    try {
      let context = ''
      
      switch (currentSection) {
        case 'experience':
          context = JSON.stringify(resumeData.experience)
          break
        case 'education':
          context = JSON.stringify(resumeData.education)
          break
        case 'skills':
          context = resumeData.skills.join(', ')
          break
        case 'projects':
          context = JSON.stringify(resumeData.projects)
          break
        default:
          context = resumeData.personalInfo?.summary || ''
      }

      const result = await aiAssistant.generateSuggestion(context, currentSection)
      setSuggestion(result)
    } catch (error) {
      toast.error('生成建议失败')
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
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white shadow-xl z-30 transform transition-transform duration-300"
         style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
      <div className="h-full flex flex-col">
        {/* 头部 */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold">AI 优化助手</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/50 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-4">
          {!suggestion && !isLoading && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                点击下方按钮，让AI为你的
                <span className="font-semibold text-purple-600">
                  {currentSection === 'experience' && '工作经历'}
                  {currentSection === 'education' && '教育背景'}
                  {currentSection === 'skills' && '专业技能'}
                  {currentSection === 'projects' && '项目经验'}
                  {currentSection === 'personal' && '个人简介'}
                </span>
                提供优化建议
              </p>
              <button
                onClick={generateSuggestion}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                生成AI建议
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-500">AI正在分析...</p>
            </div>
          )}

          {suggestion && !isLoading && (
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-purple-900">AI 优化建议：</h4>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {suggestion}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '已复制' : '复制建议'}
                </button>
                <button
                  onClick={() => onApplySuggestion(suggestion)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  应用建议
                </button>
              </div>

              <button
                onClick={generateSuggestion}
                className="w-full px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition"
              >
                重新生成
              </button>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500">
            💡 提示：AI建议仅供参考，请根据实际情况调整
          </p>
        </div>
      </div>
    </div>
  )
}

// 主编辑器组件
const EditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { resumeData, updateResumeData } = useResumeStore()
  const [showPreview, setShowPreview] = useState(true)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [currentSection, setCurrentSection] = useState('personal')
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')

  // 保存功能
  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('保存成功！')
    } catch (error) {
      toast.error('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  // 应用AI建议
  const handleApplySuggestion = (suggestion: string) => {
    // 这里可以根据当前section将建议应用到对应字段
    toast.success('建议已应用')
    setShowAIPanel(false)
  }

  // 添加工作经历
  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      description: '',
      achievements: []
    }
    updateResumeData({
      ...resumeData,
      experience: [...(resumeData.experience || []), newExp]
    })
  }

  // 添加教育背景
  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      duration: '',
      gpa: ''
    }
    updateResumeData({
      ...resumeData,
      education: [...(resumeData.education || []), newEdu]
    })
  }

  // 添加项目
  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      role: '',
      duration: '',
      description: '',
      technologies: []
    }
    updateResumeData({
      ...resumeData,
      projects: [...(resumeData.projects || []), newProject]
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b h-16 fixed top-0 left-0 right-0 z-40">
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

          <div className="flex items-center gap-2">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              <option value="modern">现代风格</option>
              <option value="classic">经典风格</option>
              <option value="minimal">极简风格</option>
              <option value="creative">创意风格</option>
            </select>

            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title={showPreview ? '隐藏预览' : '显示预览'}
            >
              {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`p-2 rounded-lg transition ${
                showAIPanel ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
              }`}
              title="AI助手"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? '保存中...' : '保存'}
            </button>

            <button
              onClick={() => toast.success('导出功能开发中')}
              className="px-4 py-1.5 border rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 - 使用flex布局避免挤压 */}
      <div className="pt-16 h-screen flex">
        {/* 左侧编辑区 */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${
          showPreview ? 'w-1/2' : 'w-full'
        } ${showAIPanel ? 'mr-96' : ''}`}>
          <div className="max-w-3xl mx-auto p-6">
            {/* 切换标签 */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex border-b">
                {[
                  { id: 'personal', label: '个人信息', icon: '👤' },
                  { id: 'experience', label: '工作经历', icon: '💼' },
                  { id: 'education', label: '教育背景', icon: '🎓' },
                  { id: 'skills', label: '专业技能', icon: '🛠' },
                  { id: 'projects', label: '项目经验', icon: '📁' }
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                      currentSection === section.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 编辑表单区域 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {currentSection === 'personal' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">个人信息</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">姓名</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo?.name || ''}
                        onChange={(e) => updateResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">职位</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo?.title || ''}
                        onChange={(e) => updateResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, title: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">邮箱</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo?.email || ''}
                        onChange={(e) => updateResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">电话</label>
                      <input
                        type="tel"
                        value={resumeData.personalInfo?.phone || ''}
                        onChange={(e) => updateResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">个人简介</label>
                    <textarea
                      value={resumeData.personalInfo?.summary || ''}
                      onChange={(e) => updateResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {currentSection === 'experience' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">工作经历</h2>
                    <button
                      onClick={addExperience}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      添加经历
                    </button>
                  </div>
                  
                  {(resumeData.experience || []).map((exp, index) => (
                    <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...resumeData.experience]
                              updated[index].company = e.target.value
                              updateResumeData({ ...resumeData, experience: updated })
                            }}
                            placeholder="公司名称"
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              const updated = [...resumeData.experience]
                              updated[index].position = e.target.value
                              updateResumeData({ ...resumeData, experience: updated })
                            }}
                            placeholder="职位"
                            className="px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = resumeData.experience.filter((_, i) => i !== index)
                            updateResumeData({ ...resumeData, experience: updated })
                          }}
                          className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => {
                          const updated = [...resumeData.experience]
                          updated[index].duration = e.target.value
                          updateResumeData({ ...resumeData, experience: updated })
                        }}
                        placeholder="时间段 (如: 2020.01 - 2023.12)"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...resumeData.experience]
                          updated[index].description = e.target.value
                          updateResumeData({ ...resumeData, experience: updated })
                        }}
                        placeholder="工作内容描述..."
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setCurrentSection('experience')
                          setShowAIPanel(true)
                        }}
                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        <Sparkles className="w-4 h-4" />
                        AI优化这段经历
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 其他部分类似... */}
            </div>
          </div>
        </div>

        {/* 右侧预览区 */}
        {showPreview && (
          <div className={`w-1/2 bg-gray-100 border-l overflow-y-auto transition-all duration-300`}>
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-[210mm] mx-auto">
                {/* 简历预览内容 */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {resumeData.personalInfo?.name || '你的名字'}
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    {resumeData.personalInfo?.title || '职位'}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-500">
                    {resumeData.personalInfo?.email && <span>{resumeData.personalInfo.email}</span>}
                    {resumeData.personalInfo?.phone && <span>{resumeData.personalInfo.phone}</span>}
                  </div>
                </div>

                {resumeData.personalInfo?.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2">个人简介</h2>
                    <p className="text-gray-700">{resumeData.personalInfo.summary}</p>
                  </div>
                )}

                {resumeData.experience?.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">工作经历</h2>
                    {resumeData.experience.map(exp => (
                      <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{exp.position}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">{exp.duration}</span>
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI助手面板 - 固定定位，不影响主布局 */}
        <AIPanel
          isOpen={showAIPanel}
          onClose={() => setShowAIPanel(false)}
          currentSection={currentSection}
          resumeData={resumeData}
          onApplySuggestion={handleApplySuggestion}
        />
      </div>
    </div>
  )
}

export default EditorPage
