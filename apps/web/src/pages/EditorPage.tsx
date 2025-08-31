import React, { useState, useRef, useEffect } from 'react'
import {
  Save,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Settings,
  Palette,
  Share2,
  Undo,
  Redo,
  Copy,
  CheckCircle
} from 'lucide-react'

interface ResumeData {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
    achievements: string[]
  }>
  education: Array<{
    id: string
    school: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa: string
    achievements: string[]
  }>
  skills: Array<{
    id: string
    category: string
    items: string[]
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    link: string
  }>
}

export default function EditorPage() {
  const [activeSection, setActiveSection] = useState('personal')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [undoStack, setUndoStack] = useState<ResumeData[]>([])
  const [redoStack, setRedoStack] = useState<ResumeData[]>([])
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  })

  const sections = [
    { id: 'personal', label: '个人信息', icon: User },
    { id: 'experience', label: '工作经历', icon: Briefcase },
    { id: 'education', label: '教育背景', icon: GraduationCap },
    { id: 'skills', label: '专业技能', icon: Award },
    { id: 'projects', label: '项目经验', icon: FileText }
  ]

  const templates = [
    { id: 'modern', name: '现代简约' },
    { id: 'professional', name: '专业商务' },
    { id: 'creative', name: '创意设计' },
    { id: 'minimal', name: '极简主义' },
    { id: 'ats', name: 'ATS优化' }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 保存到本地存储
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      await new Promise(resolve => setTimeout(resolve, 1000))
      // 显示成功提示
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1]
      setRedoStack([...redoStack, resumeData])
      setResumeData(previousState)
      setUndoStack(undoStack.slice(0, -1))
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1]
      setUndoStack([...undoStack, resumeData])
      setResumeData(nextState)
      setRedoStack(redoStack.slice(0, -1))
    }
  }

  const updateResumeData = (updates: Partial<ResumeData>) => {
    setUndoStack([...undoStack, resumeData])
    setRedoStack([])
    setResumeData({ ...resumeData, ...updates })
  }

  const handleAISuggestion = async (field: string) => {
    setShowAIPanel(true)
    setAiSuggestion('正在生成AI建议...')
    
    // 模拟AI生成建议
    setTimeout(() => {
      setAiSuggestion(`基于你的背景，建议在${field}部分添加以下内容：\n\n• 量化你的成就，使用具体数字\n• 使用动作动词开始每个要点\n• 突出与目标职位相关的关键技能`)
    }, 1500)
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    }
    updateResumeData({ experience: [...resumeData.experience, newExp] })
  }

  const removeExperience = (id: string) => {
    updateResumeData({
      experience: resumeData.experience.filter(exp => exp.id !== id)
    })
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: []
    }
    updateResumeData({ education: [...resumeData.education, newEdu] })
  }

  const removeEducation = (id: string) => {
    updateResumeData({
      education: resumeData.education.filter(edu => edu.id !== id)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold">简历编辑器</h1>
            </div>

            <div className="flex items-center gap-2">
              {/* 撤销/重做 */}
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                title="撤销"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                title="重做"
              >
                <Redo className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              {/* 模板选择 */}
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>

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
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`p-2 rounded-lg transition ${
                  showAIPanel ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
                }`}
                title="AI助手"
              >
                <Sparkles className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              {/* 操作按钮 */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? '保存中...' : '保存'}
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出
              </button>

              <button
                className="px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                分享
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 左侧导航 */}
        <aside className="w-64 bg-white border-r">
          <nav className="p-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition mb-2 ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
                {section.id === 'experience' && resumeData.experience.length > 0 && (
                  <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {resumeData.experience.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* 中间编辑区 */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6">
            {/* 个人信息 */}
            {activeSection === 'personal' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">个人信息</h2>
                  <button
                    onClick={() => handleAISuggestion('个人简介')}
                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI优化
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="张三"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      职位
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.title}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="产品经理"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      邮箱 *
                    </label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="zhangsan@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      电话
                    </label>
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="138xxxx8888"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      所在地
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="北京市"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="linkedin.com/in/zhangsan"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      个人简介
                    </label>
                    <textarea
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="简要介绍你的职业背景和核心优势..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 工作经历 */}
            {activeSection === 'experience' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">工作经历</h2>
                  <button
                    onClick={addExperience}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    添加经历
                  </button>
                </div>

                {resumeData.experience.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>还没有添加工作经历</p>
                    <button
                      onClick={addExperience}
                      className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                      添加第一份工作经历
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...resumeData.experience]
                                updated[index].company = e.target.value
                                updateResumeData({ experience: updated })
                              }}
                              className="px-3 py-2 border rounded-lg"
                              placeholder="公司名称"
                            />
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => {
                                const updated = [...resumeData.experience]
                                updated[index].position = e.target.value
                                updateResumeData({ experience: updated })
                              }}
                              className="px-3 py-2 border rounded-lg"
                              placeholder="职位"
                            />
                          </div>
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => {
                              const updated = [...resumeData.experience]
                              updated[index].location = e.target.value
                              updateResumeData({ experience: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                            placeholder="工作地点"
                          />
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = [...resumeData.experience]
                              updated[index].startDate = e.target.value
                              updateResumeData({ experience: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => {
                              const updated = [...resumeData.experience]
                              updated[index].endDate = e.target.value
                              updateResumeData({ experience: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                            disabled={exp.current}
                          />
                        </div>

                        <div className="mb-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => {
                                const updated = [...resumeData.experience]
                                updated[index].current = e.target.checked
                                updateResumeData({ experience: updated })
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">目前在职</span>
                          </label>
                        </div>

                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...resumeData.experience]
                            updated[index].description = e.target.value
                            updateResumeData({ experience: updated })
                          }}
                          rows={4}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="描述你的工作职责和成就..."
                        />

                        <button
                          onClick={() => handleAISuggestion(`工作经历${index + 1}`)}
                          className="mt-2 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                          <Sparkles className="w-4 h-4" />
                          AI优化这段经历
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 教育背景 */}
            {activeSection === 'education' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">教育背景</h2>
                  <button
                    onClick={addEducation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    添加教育
                  </button>
                </div>

                {resumeData.education.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>还没有添加教育背景</p>
                    <button
                      onClick={addEducation}
                      className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                      添加教育经历
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => {
                                const updated = [...resumeData.education]
                                updated[index].school = e.target.value
                                updateResumeData({ education: updated })
                              }}
                              className="px-3 py-2 border rounded-lg"
                              placeholder="学校名称"
                            />
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...resumeData.education]
                                updated[index].degree = e.target.value
                                updateResumeData({ education: updated })
                              }}
                              className="px-3 py-2 border rounded-lg"
                              placeholder="学位"
                            />
                          </div>
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => {
                              const updated = [...resumeData.education]
                              updated[index].field = e.target.value
                              updateResumeData({ education: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                            placeholder="专业"
                          />
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => {
                              const updated = [...resumeData.education]
                              updated[index].startDate = e.target.value
                              updateResumeData({ education: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => {
                              const updated = [...resumeData.education]
                              updated[index].endDate = e.target.value
                              updateResumeData({ education: updated })
                            }}
                            className="px-3 py-2 border rounded-lg"
                          />
                        </div>

                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => {
                            const updated = [...resumeData.education]
                            updated[index].gpa = e.target.value
                            updateResumeData({ education: updated })
                          }}
                          className="w-full px-3 py-2 border rounded-lg mb-4"
                          placeholder="GPA (可选)"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* 右侧预览 */}
        {showPreview && (
          <aside className="w-1/2 bg-gray-100 border-l overflow-y-auto">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {resumeData.personalInfo.name || '你的名字'}
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    {resumeData.personalInfo.title || '职位'}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-500">
                    {resumeData.personalInfo.email && (
                      <span>{resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.phone && (
                      <span>{resumeData.personalInfo.phone}</span>
                    )}
                    {resumeData.personalInfo.location && (
                      <span>{resumeData.personalInfo.location}</span>
                    )}
                  </div>
                </div>

                {resumeData.personalInfo.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">个人简介</h2>
                    <p className="text-gray-700">{resumeData.personalInfo.summary}</p>
                  </div>
                )}

                {resumeData.experience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">工作经历</h2>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{exp.position}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {exp.startDate} - {exp.current ? '至今' : exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.education.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">教育背景</h2>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{edu.degree} - {edu.field}</h3>
                            <p className="text-gray-600">{edu.school}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                        {edu.gpa && (
                          <p className="mt-1 text-sm text-gray-600">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* AI助手面板 */}
        {showAIPanel && (
          <aside className="w-80 bg-white border-l">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI助手
                </h3>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {aiSuggestion ? (
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {aiSuggestion}
                    </p>
                  </div>
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    应用建议
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                  <p className="text-sm">点击任何"AI优化"按钮获取智能建议</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
