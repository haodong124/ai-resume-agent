import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Download } from 'lucide-react'
import { ResumeEditor } from '../components/ResumeEditor'
import { SimpleAIChat } from '../components/SimpleAIChat'
import { useResumeStore } from '../features/resume/state'
import { ResumeAPI } from '../features/resume/api'
import toast from 'react-hot-toast'

export const EditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { resumeData, selectedTemplate, updateResumeData, setTemplate } = useResumeStore()
  const [showAIChat, setShowAIChat] = useState(true)
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
                onClick={() => handleSave()}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
        <div className="flex-1 overflow-auto">
          <ResumeEditor
            resumeData={resumeData}
            setResumeData={updateResumeData}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setTemplate}
          />
        </div>

        {/* AI Chat Sidebar */}
        {showAIChat && (
          <div className="w-96 border-l bg-white">
            <SimpleAIChat />
          </div>
        )}
      </div>
    </div>
  )
}
