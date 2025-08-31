import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Download, Eye, EyeOff } from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import toast from 'react-hot-toast'

// 临时简单组件，避免构建错误
const SimpleResumeEditor: React.FC<{
  resumeData: any
  setResumeData: (data: any) => void
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}> = ({ resumeData, setResumeData, selectedTemplate, onTemplateChange }) => {
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">个人信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">姓名</label>
            <input
              type="text"
              value={resumeData.personalInfo?.name || ''}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="请输入您的姓名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">邮箱</label>
            <input
              type="email"
              value={resumeData.personalInfo?.email || ''}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">电话</label>
            <input
              type="tel"
              value={resumeData.personalInfo?.phone || ''}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="请输入手机号码"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">所在地</label>
            <input
              type="text"
              value={resumeData.personalInfo?.location || ''}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="城市"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">个人简介</label>
          <textarea
            value={resumeData.personalInfo?.summary || ''}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="简要描述您的职业背景和优势..."
          />
        </div>
      </div>
    </div>
  )
}

// 简单的预览组件
const SimpleResumePreview: React.FC<{ data: any; template: string }> = ({ data }) => {
  return (
    <div className="bg-white p-8 shadow-lg max-w-[210mm] mx-auto">
      <div className="text-center border-b pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {data.personalInfo?.name || '您的姓名'}
        </h1>
        <div className="text-gray-600 space-y-1">
          {data.personalInfo?.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo?.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo?.location && <p>{data.personalInfo.location}</p>}
        </div>
      </div>
      
      {data.personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">个人简介</h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      <div className="text-center text-gray-500 py-8">
        <p>继续完善简历内容...</p>
      </div>
    </div>
  )
}

// 简单的AI聊天组件占位符
const SimpleAIChat: React.FC = () => {
  return (
    <div className="h-full bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold text-gray-800 mb-4">AI 简历助手</h3>
      <div className="text-center text-gray-500 py-8">
        <p>AI助手功能开发中...</p>
        <p className="text-sm mt-2">敬请期待！</p>
      </div>
    </div>
  )
}

export const EditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { resumeData, selectedTemplate, updateResumeData, setTemplate } = useResumeStore()
  const [showAIChat, setShowAIChat] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // 自动保存
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      handleSave(true)
    }, 30000) // 每30秒自动保存

    return () => clearInterval(autoSaveTimer)
  }, [resumeData])

  const handleSave = async (isAutoSave = false) => {
    setIsSaving(true)
    try {
      // 保存到本地存储（Zustand已经处理）
      if (!isAutoSave) {
        toast.success('简历已保存')
      }
    } catch (error) {
      toast.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleExport = () => {
    toast.info('导出功能开发中，敬请期待！')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold">简历编辑器</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? '隐藏预览' : '显示预览'}</span>
              </button>
              
              <button
                onClick={() => setShowAIChat(!showAIChat)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>{showAIChat ? '隐藏助手' : 'AI助手'}</span>
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>导出</span>
              </button>
              
              <button
                onClick={() => handleSave()}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? '保存中...' : '保存'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Editor */}
        <div className={`${showPreview ? 'flex-1' : 'w-full'} overflow-auto`}>
          <SimpleResumeEditor
            resumeData={resumeData}
            setResumeData={updateResumeData}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setTemplate}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 border-l bg-gray-50 overflow-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">预览</h3>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="standard">标准模板</option>
                  <option value="modern">现代模板</option>
                  <option value="professional">专业模板</option>
                </select>
              </div>
              <div className="bg-white">
                <SimpleResumePreview
                  data={resumeData}
                  template={selectedTemplate}
                />
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Sidebar */}
        {showAIChat && (
          <div className="w-80 border-l bg-white">
            <SimpleAIChat />
          </div>
        )}
      </div>
    </div>
  )
}

// 确保默认导出
export default EditorPage
